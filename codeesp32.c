#include <WiFi.h>
#include <HTTPClient.h>
// Updated ESP32 client to POST HTTPS to Vercel serverless endpoint
// - Uses WiFiClientSecure with setInsecure() for easy TLS (ok for prototype)
// - Adds NTP time sync to send ISO timestamp
// - Configurable SERVER_URL and DEVICE_ID

#include <WiFiClientSecure.h>
#include <time.h>

// --- CONFIGURE AQUI ---
const char* WIFI_SSID = "M3";
const char* WIFI_PASS = "1234567890";
// Exemplo: https://your-vercel-app.vercel.app/api/sensor-data
const char* SERVER_URL = "https://<YOUR-VERCEL-APP>.vercel.app/api/sensor-data";
const char* DEVICE_ID = "ESP32-001";

// Pinos
const int SENSOR_PIN = 34;
const int BUZZER_PIN = 25;

// Intervalos
const unsigned long POST_INTERVAL_MS = 5000; // 5s entre posts
unsigned long lastPostMillis = 0;
unsigned long lastBipTime = 0;

// Optional: add an API key header if you protect the serverless endpoint
// const char* API_KEY = "your-secret-key";

void setupTime() {
  // NTP para timestamps legíveis
  configTime(0, 0, "pool.ntp.org", "time.google.com");
  Serial.print("Aguardando sincronização de tempo");
  time_t now = time(nullptr);
  unsigned long start = millis();
  while (now < 24 * 3600) {
    delay(200);
    Serial.print('.');
    now = time(nullptr);
    if (millis() - start > 10000) break; // tempo limite
  }
  Serial.println();
}

String isoTimestamp() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  char buf[32];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buf);
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Conectando ao WiFi");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
    if (millis() - start > 20000) break; // timeout 20s
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado ao WiFi!");
    Serial.print("IP: "); Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFalha ao conectar ao WiFi");
  }

  setupTime();
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN);
  Serial.print("Sensor: "); Serial.println(sensorValue);

  // Buzzer lógico (prototipagem)
  if (sensorValue > 100) {
    int bipDelay = map(sensorValue, 0, 4095, 1000, 50);
    if (millis() - lastBipTime >= (unsigned long)bipDelay) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(20);
      digitalWrite(BUZZER_PIN, LOW);
      lastBipTime = millis();
    }
  }

  // POST para backend (suporta http ou https)
  if (millis() - lastPostMillis >= POST_INTERVAL_MS) {
    if (WiFi.status() == WL_CONNECTED) {
      String server = String(SERVER_URL);
      Serial.print("POST -> "); Serial.println(server);

      HTTPClient http;
      bool okBegin = false;

      if (server.startsWith("https://")) {
        // HTTPS: use secure client
        WiFiClientSecure *secureClient = new WiFiClientSecure();
        secureClient->setInsecure(); // protótipo: aceita qualquer certificado
        okBegin = http.begin(*secureClient, server);
        // Note: http.end() will free internal resources; we allocated secureClient intentionally
      } else {
        // HTTP
        okBegin = http.begin(server);
      }

      if (okBegin) {
        http.addHeader("Content-Type", "application/json");
        String payload = "{";
        payload += "\"deviceId\": \"" + String(DEVICE_ID) + "\",";
        payload += "\"value\": " + String(sensorValue) + ",";
        payload += "\"timestamp\": \"" + isoTimestamp() + "\"";
        payload += "}";

        int code = http.POST(payload);
        Serial.print("HTTP code: "); Serial.println(code);
        if (code > 0) {
          String resp = http.getString();
          Serial.print("Resposta: "); Serial.println(resp);
        } else {
          Serial.print("Falha POST, erro: "); Serial.println(code);
        }

        http.end();
      } else {
        Serial.println("Falha ao iniciar conexão HTTP/HTTPS");
      }
    } else {
      Serial.println("WiFi não conectado, pulando POST");
    }

    lastPostMillis = millis();
  }

  delay(100); // evitar loop muito apertado
}
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Código ESP32 para enviar dados de vibração ao backend
// - Conecta ao WiFi
// - Lê sensor analógico
// - Envia dados ao backend via HTTPS POST
// - Backend gera timestamp automaticamente

// --- CONFIGURE AQUI ---
const char* WIFI_SSID = "M3";
const char* WIFI_PASS = "1234567890";
// Backend Vercel com endpoint de vibração
const char* SERVER_URL = "https://geo-scan-backend.vercel.app/vibration";
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
        payload += "\"value\": " + String(sensorValue);
        payload += "}";
        // Timestamp será gerado automaticamente no backend

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
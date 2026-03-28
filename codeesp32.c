#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Código ESP32 para enviar dados de vibração ao backend
// - Conecta ao WiFi
// - Lê sensor analógico
// - Envia dados ao backend via HTTPS POST
// - Backend gera timestamp automaticamente

// --- CONFIGURE AQUI ---
const char* WIFI_SSID = "GeoScan";
const char* WIFI_PASS = "1234567890";
// Backend Vercel com endpoint de vibração
const char* SERVER_URL = "https://geo-scan-backend.vercel.app/vibration";
const char* DEVICE_ID = "ESP32-001";

// Pinos
const int SENSOR_PIN = 34;           // Vibração
const int MAGNETOMETER_PIN = 23;     // Magnetômetro
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

// Função para enviar dados de vibração
void enviarVibracaoDados(int valor) {
  String url = String(SERVER_URL);
  Serial.print("POST Vibração -> "); Serial.println(url);

  HTTPClient http;
  bool okBegin = false;

  if (url.startsWith("https://")) {
    WiFiClientSecure *secureClient = new WiFiClientSecure();
    secureClient->setInsecure();
    okBegin = http.begin(*secureClient, url);
  } else {
    okBegin = http.begin(url);
  }

  if (okBegin) {
    http.addHeader("Content-Type", "application/json");
    String payload = "{";
    payload += "\"deviceId\": \"" + String(DEVICE_ID) + "\",";
    payload += "\"value\": " + String(valor);
    payload += "}";

    int code = http.POST(payload);
    Serial.print("  HTTP: "); Serial.println(code);
    if (code > 0) {
      String resp = http.getString();
      Serial.print("  Resp: "); Serial.println(resp);
    }
    http.end();
  } else {
    Serial.println("  Falha ao conectar");
  }
}

// Função para enviar dados de magnetômetro
void enviarMagnetometroDados(int valor) {
  String url = "https://geo-scan-backend.vercel.app/magnetometer";
  Serial.print("POST Magnetômetro -> "); Serial.println(url);

  HTTPClient http;
  bool okBegin = false;

  if (url.startsWith("https://")) {
    WiFiClientSecure *secureClient = new WiFiClientSecure();
    secureClient->setInsecure();
    okBegin = http.begin(*secureClient, url);
  } else {
    okBegin = http.begin(url);
  }

  if (okBegin) {
    http.addHeader("Content-Type", "application/json");
    String payload = "{";
    payload += "\"deviceId\": \"" + String(DEVICE_ID) + "\",";
    payload += "\"value\": " + String(valor);
    payload += "}";

    int code = http.POST(payload);
    Serial.print("  HTTP: "); Serial.println(code);
    if (code > 0) {
      String resp = http.getString();
      Serial.print("  Resp: "); Serial.println(resp);
    }
    http.end();
  } else {
    Serial.println("  Falha ao conectar");
  }
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN);
  int magnetometerValue = analogRead(MAGNETOMETER_PIN);
  
  Serial.print("Vibração: "); Serial.print(sensorValue);
  Serial.print(" | Magnetômetro: "); Serial.println(magnetometerValue);

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
      // 1. Enviar vibração
      enviarVibracaoDados(sensorValue);
      
      // 2. Enviar magnetômetro
      enviarMagnetometroDados(magnetometerValue);
      
      lastPostMillis = millis();
    } else {
      Serial.println("WiFi não conectado, pulando POST");
    }
  }

  delay(100); // evitar loop muito apertado
}
// esp32_server.ino - exemplo simples de servidor HTTP no ESP32
// Faz leitura analógica e expõe endpoint /sensor que retorna JSON com a última leitura

#include <WiFi.h>
#include <WebServer.h>

// Configurações de rede (ajuste para sua rede)
const char* ssid = "M3";
const char* password = "1234567890";

WebServer server(80);

// Pinos
const int sensorPin = 34;
const int buzzerPin = 25;

// Última leitura
int lastSensorValue = 0;
unsigned long lastSampleMillis = 0;
const unsigned long sampleInterval = 1000; // 1s

void handleRoot() {
  server.send(200, "text/plain", "ESP32 sensor server");
}

void handleSensor() {
  // Retorna JSON simples com a última leitura
  String payload = "{";
  payload += "\"value\":" + String(lastSensorValue);
  payload += ", \"timestamp\": \"" + String(millis()) + "\"";
  payload += "}";
  server.send(200, "application/json", payload);
}

void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, OUTPUT);
  delay(100);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/sensor", handleSensor); // endpoint que retorna JSON

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  // Atualiza leitura a cada sampleInterval
  if (millis() - lastSampleMillis >= sampleInterval) {
    lastSensorValue = analogRead(sensorPin);
    lastSampleMillis = millis();

    // Exemplo de buzzer simples: bip se valor alto
    if (lastSensorValue > 100) {
      digitalWrite(buzzerPin, HIGH);
      delay(20);
      digitalWrite(buzzerPin, LOW);
    }

    Serial.println("Sensor: " + String(lastSensorValue));
  }

  server.handleClient();
}

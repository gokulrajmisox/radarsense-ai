#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <time.h>

// =====================================================
// WIFI
// =====================================================

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// =====================================================
// SUPABASE
// =====================================================

const char* SUPABASE_URL = "https://xbcmiovlfxgbmaufwaoa.supabase.co";
const char* SUPABASE_KEY = "sb_publishable_WZqf1KQDAzkOhmyrj4sF4Q_90T61iLq";
const char* SUPABASE_TABLE = "/rest/v1/radar_readings";

// =====================================================
// DEVICE
// =====================================================

const char* DEVICE_ID = "RADAR-ESP32-01";

// =====================================================
// PINS (Updated to your new wiring)
// =====================================================

#define TRIG_PIN 12
#define ECHO_PIN 14
#define SERVO_PIN 13

// =====================================================
// RADAR
// =====================================================

Servo radarServo;
WebServer server(80);

int currentAngle = 15;
float currentDistance = 0;
float previousDistance = 0;

String dangerLevel = "SAFE";
String movementStatus = "STATIONARY";

unsigned long lastSupabaseUpload = 0;
const unsigned long SUPABASE_INTERVAL = 1000; // Upload once per second

// =====================================================
// THRESHOLDS
// =====================================================

#define WARNING_DISTANCE 30
#define DANGER_DISTANCE 15

// =====================================================
// GET DISTANCE
// =====================================================

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration == 0) {
    return 400; // Timeout, assuming max distance
  }

  float distance = duration * 0.0343 / 2.0;

  if (distance < 2) distance = 2;
  if (distance > 400) distance = 400;

  return distance;
}

// =====================================================
// DANGER LEVEL
// =====================================================

String getDangerLevel(float distance) {
  if (distance <= DANGER_DISTANCE) return "DANGER";
  if (distance <= WARNING_DISTANCE) return "WARNING";
  return "SAFE";
}

// =====================================================
// MOVEMENT DETECTION
// =====================================================

String getMovement(float distance) {
  if (previousDistance == 0) {
    previousDistance = distance;
    return "STATIONARY";
  }

  float difference = previousDistance - distance;
  previousDistance = distance;

  if (difference > 3) return "APPROACHING";
  if (difference < -3) return "MOVING_AWAY";
  
  return "STATIONARY";
}

// =====================================================
// TIME
// =====================================================

String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "";
  
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%S%z", &timeinfo);
  return String(timestamp);
}

// =====================================================
// SEND TO SUPABASE
// =====================================================

void sendToSupabase() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(SUPABASE_URL) + SUPABASE_TABLE;
  
  http.begin(url);
  http.addHeader("apikey", SUPABASE_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");

  JsonDocument doc;
  doc["device_id"] = DEVICE_ID;
  doc["angle"] = currentAngle;
  doc["distance_cm"] = currentDistance;
  doc["danger_level"] = dangerLevel;
  doc["movement_status"] = movementStatus;

  String timestamp = getTimestamp();
  if (timestamp.length() > 0) doc["measured_at"] = timestamp;

  String json;
  serializeJson(doc, json);

  int responseCode = http.POST(json);

  Serial.println("\n========== SUPABASE ==========");
  Serial.print("Data Sent: "); Serial.println(json);
  Serial.print("Response: "); Serial.println(responseCode);
  Serial.println("==============================\n");

  http.end();
}

// =====================================================
// WEB DATA API (For Local Dashboard)
// =====================================================

void handleData() {
  String json = "{";
  json += "\"angle\":" + String(currentAngle) + ",";
  json += "\"distance\":" + String(currentDistance, 1) + ",";
  json += "\"movement\":\"" + movementStatus + "\",";
  json += "\"danger\":\"" + dangerLevel + "\"";
  json += "}";
  server.send(200, "application/json", json);
}

// =====================================================
// WIFI & TIME SETUP
// =====================================================

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected! IP: " + WiFi.localIP().toString());
}

void setupTime() {
  configTime(19800, 0, "pool.ntp.org", "time.nist.gov"); // India timezone
  Serial.println("Synchronizing time...");
  struct tm timeinfo;
  if (getLocalTime(&timeinfo, 10000)) Serial.println("Time synchronized!");
}

// =====================================================
// SETUP
// =====================================================

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Setup Pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Advanced ESP32 Servo Setup (From your snippet)
  radarServo.setPeriodHertz(50);
  radarServo.attach(SERVO_PIN, 500, 2400);
  radarServo.write(15);

  connectWiFi();
  setupTime();

  // Basic API Endpoint for Local Web Dashboard
  server.on("/data", handleData);
  server.begin();
  
  Serial.println("System Ready!");
}

// =====================================================
// CORE RADAR LOGIC
// =====================================================

void processRadarReading(int angle) {
  currentAngle = angle;
  radarServo.write(currentAngle);
  
  delay(30); // 30ms delay based on your snippet
  
  currentDistance = getDistance();
  dangerLevel = getDangerLevel(currentDistance);
  movementStatus = getMovement(currentDistance);

  // Serial Monitor output formatted for Visualizers like Processing
  Serial.print(currentAngle); 
  Serial.print(","); 
  Serial.print(currentDistance); 
  Serial.print(".");
  Serial.println(); // Added newline so it's readable in standard Arduino monitor too

  // Send to Supabase once per second
  if (millis() - lastSupabaseUpload >= SUPABASE_INTERVAL) {
    sendToSupabase();
    lastSupabaseUpload = millis();
  }

  // Handle local dashboard requests
  server.handleClient();
}

// =====================================================
// LOOP
// =====================================================

void loop() {
  // Sweep from 15 to 165 degrees
  for(int i = 15; i <= 165; i++) {  
    processRadarReading(i);
  }
  
  // Sweep back from 165 to 15 degrees
  for(int i = 165; i >= 15; i--) {  
    processRadarReading(i);
  }
}

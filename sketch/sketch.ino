#include "Arduino.h"
#include <Arduino_APDS9960.h>

//RGB LED Pins
#define RED 22     
#define BLUE 24     
#define GREEN 23

void setup()
{
    pinMode(RED, OUTPUT);
    pinMode(GREEN, OUTPUT);
    pinMode(BLUE, OUTPUT);
  
    Serial.begin(115200);
    APDS.begin();
}

void loop()
{
    //Read gestures from sensor and send to serial / browser
    if (APDS.gestureAvailable()) {
      int gesture = APDS.readGesture();
      Serial.println(gesture);
    }

    //Read incoming rgb color from serial / browser (format: 0,0,1)
    if (Serial.available())
    {
      String redValue = Serial.readStringUntil(',');
      String greenValue = Serial.readStringUntil(',');
      String blueValue = Serial.readStringUntil('\n');
      digitalWrite(RED, redValue.toInt());
      digitalWrite(GREEN, greenValue.toInt());
      digitalWrite(BLUE, blueValue.toInt());
    }
}

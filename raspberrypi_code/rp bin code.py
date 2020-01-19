#!/usr/bin/python

import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt
import time

client = mqtt.Client()
client.connect("172.20.10.11",1234,60)

GPIO.setmode(GPIO.BCM)
TRIG = 23
ECHO = 24
GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)
GPIO.output(TRIG, False)

for n in range(30):

        print "Waiting For Sensor To Settle"

        time.sleep(2)
        GPIO.output(TRIG, True)
        time.sleep(0.00001)
        GPIO.output(TRIG, False)

        while GPIO.input(ECHO)==0:
                pulse_start = time.time()
        while GPIO.input(ECHO)==1:
                pulse_end = time.time()
        pulse_duration = pulse_end - pulse_start

        distance = pulse_duration*17150
        distance = round(distance, 2)
        print "Distance:",distance,"cm"
        client.publish("topic/test", distance)

GPIO.cleanup()

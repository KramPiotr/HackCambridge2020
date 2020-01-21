#!/usr/bin/python

import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt
import time
import base64
from subprocess import call

GPIO.setmode(GPIO.BCM)
TRIG = 23
ECHO = 24
GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)
GPIO.output(TRIG, False)

client = mqtt.Client()
client.connect("172.20.10.11", 1234, 60)

for n in range(30):

        print "Waiting For Sensor To Settle"

        time.sleep(15)
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
        full = 100
        if distance > 115:
                full = 0
        elif distance < 25:
                full = 100
        else:
                full = 120 - distance
		full = full * 0.8
        message = "{\"id\":5,\"latitude\":50,\"longtitude\":0,\"full\":"+str(full)+"}"
        client.publish("bin", message)

	call(["fswebcam",  "./image.jpg"])
	with open("image.jpg", "rb") as image:
		b64string = base64.b64encode(image.read())
		client.publish("image", b64string)

client.disconnect()
GPIO.cleanup()

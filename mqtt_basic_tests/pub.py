#!/usr/bin/env python3

import paho.mqtt.client as mqtt

# This is the Publisher

client = mqtt.Client()
client.connect("172.20.4.157",1234,60)

while(True):
	input_user = input("Enter your input : ")
	client.publish("topic/test", input_user)

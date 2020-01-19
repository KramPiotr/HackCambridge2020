#!/bin/bash
echo "IP address is: "
ipconfig getifaddr en0
echo
mosquitto -p 1234


#!/bin/bash

# DISPLAY Setup
export DISPLAY=:0

# Kill any existing Firefox processes for the user 'ruthgyeul'
pkill -u ruthgyeul firefox

# Activate the firefox kiosk mode
firefox --kiosk http://localhost:3000
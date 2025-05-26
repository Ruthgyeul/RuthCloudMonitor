#!/bin/bash

echo "=== Network Interface Test ==="
echo "1. Checking network interfaces..."
ip link show | grep 'state UP'

echo -e "\n2. Testing network interface detection..."
echo "Ethernet interface:"
ip link show | grep 'state UP' | grep 'enp' | awk -F': ' '{print $2}'
echo "WiFi interface:"
ip link show | grep 'state UP' | grep 'wlp' | awk -F': ' '{print $2}'

echo -e "\n3. Testing network statistics..."
echo "Using netstat -i:"
netstat -i

echo -e "\n4. Testing network speed (1 second interval)..."
echo "First measurement:"
netstat -i | grep -E 'enp|wlp'
sleep 1
echo "Second measurement:"
netstat -i | grep -E 'enp|wlp'

echo -e "\n5. Testing ping latency..."
ping -c 3 8.8.8.8 | grep "avg"

echo -e "\n=== Test Complete ===" 
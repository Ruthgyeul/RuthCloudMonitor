#!/bin/bash

echo "=== Network Interface Test ==="
ip route get 8.8.8.8 | awk '{print $5}'

echo -e "\n=== Network Statistics Test ==="
netstat -i | grep -v "Kernel\|Iface"

echo -e "\n=== Network Speed Test ==="
# First measurement
echo "First measurement:"
netstat -i | grep -v "Kernel\|Iface"
sleep 1
# Second measurement
echo "Second measurement:"
netstat -i | grep -v "Kernel\|Iface"

echo -e "\n=== Ping Test ==="
ping -c 3 8.8.8.8 | grep 'avg' | awk -F'/' '{print $5}' 
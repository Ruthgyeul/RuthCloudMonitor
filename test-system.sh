#!/bin/bash

echo "=== CPU Information ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}'
echo "CPU Temperature:"
sensors | grep "Package id 0" | awk '{print $4}' | sed 's/+//' | sed 's/°C//'
echo "CPU Cores:"
nproc

echo -e "\n=== Memory Information ==="
free -m | grep Mem

echo -e "\n=== Disk Information ==="
df -h / | tail -1

echo -e "\n=== Network Information ==="
echo "Interface:"
ip route get 8.8.8.8 | awk '{print $5}'
echo "Network Stats:"
netstat -i | grep -v "Kernel\|Iface"
echo "Network Speed Test (1s interval):"
netstat -i | grep -v "Kernel\|Iface"
sleep 1
netstat -i | grep -v "Kernel\|Iface"
echo "Ping Test:"
ping -c 3 8.8.8.8 | grep 'avg' | awk -F'/' '{print $5}'

echo -e "\n=== System Uptime ==="
uptime -p

echo -e "\n=== Temperature Information ==="
echo "CPU Temperature:"
sensors | grep "Package id 0" | awk '{print $4}' | sed 's/+//' | sed 's/°C//'
echo "GPU Temperature:"
nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits 2>/dev/null || echo "N/A"
echo "Motherboard Temperature:"
sensors | grep "temp1" | awk '{print $2}' | sed 's/+//' | sed 's/°C//'

echo -e "\n=== Fan Speed ==="
echo "CPU Fan:"
sensors | grep "fan1" | awk '{print $2}'
echo "Case Fan 1:"
sensors | grep "fan2" | awk '{print $2}'
echo "Case Fan 2:"
sensors | grep "fan3" | awk '{print $2}'

echo -e "\n=== Top Processes ==="
ps aux --sort=-%cpu | head -n 16 | tail -n 15 
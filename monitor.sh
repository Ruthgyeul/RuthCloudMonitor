#!/bin/bash

# CPU 사용량
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
cpu_cores=$(nproc)

# 메모리 사용량
memory_info=$(free -m | grep Mem)
memory_used=$(echo $memory_info | awk '{print $3}')
memory_total=$(echo $memory_info | awk '{print $2}')
memory_percentage=$(echo "scale=2; ($memory_used / $memory_total) * 100" | bc)

# 디스크 사용량
disk_info=$(df -h / | tail -n 1)
disk_used=$(echo $disk_info | awk '{print $3}' | sed 's/G//')
disk_total=$(echo $disk_info | awk '{print $2}' | sed 's/G//')
disk_percentage=$(echo $disk_info | awk '{print $5}' | sed 's/%//')

# 네트워크 정보
network_info=$(ifconfig | grep -A 1 "eth0\|wlan0" | grep "RX packets\|TX packets" | awk '{print $5}')
rx_bytes=$(echo $network_info | head -n 1)
tx_bytes=$(echo $network_info | tail -n 1)
rx_mb=$(echo "scale=2; $rx_bytes / 1048576" | bc)
tx_mb=$(echo "scale=2; $tx_bytes / 1048576" | bc)

# 네트워크 에러율
network_errors=$(ifconfig | grep -A 1 "eth0\|wlan0" | grep "RX errors\|TX errors" | awk '{print $3}')
rx_errors=$(echo $network_errors | head -n 1)
tx_errors=$(echo $network_errors | tail -n 1)

# 시스템 가동 시간
uptime_seconds=$(cat /proc/uptime | awk '{print $1}')
uptime_days=$(echo "scale=0; $uptime_seconds / 86400" | bc)
uptime_hours=$(echo "scale=0; ($uptime_seconds % 86400) / 3600" | bc)
uptime_minutes=$(echo "scale=0; ($uptime_seconds % 3600) / 60" | bc)

# 온도 정보 (x86/x64와 ARM 아키텍처 모두 지원)
if [ "$(uname -m)" = "x86_64" ] || [ "$(uname -m)" = "i686" ]; then
    # x86/x64 아키텍처
    cpu_temp=$(sensors | grep "Package id 0" | awk '{print $4}' | sed 's/+//' | sed 's/°C//')
    gpu_temp=$(sensors | grep "edge" | awk '{print $2}' | sed 's/+//' | sed 's/°C//')
    mb_temp=$(sensors | grep "SYSTIN" | awk '{print $3}' | sed 's/+//' | sed 's/°C//')
else
    # ARM 아키텍처 (Raspberry Pi 등)
    cpu_temp=$(sensors | grep "cpu_thermal" | grep "temp1" | awk '{print $2}' | sed 's/+//' | sed 's/°C//')
    gpu_temp=$(sensors | grep "rp1_adc" | grep "temp1" | awk '{print $2}' | sed 's/+//' | sed 's/°C//')
    mb_temp=$(sensors | grep "nvme" | grep "Composite" | awk '{print $2}' | sed 's/+//' | sed 's/°C//')
fi

# 팬 속도
if [ "$(uname -m)" = "x86_64" ] || [ "$(uname -m)" = "i686" ]; then
    # x86/x64 아키텍처
    cpu_fan=$(sensors | grep "fan1" | awk '{print $2}')
    case1_fan=$(sensors | grep "fan2" | awk '{print $2}')
    case2_fan=$(sensors | grep "fan3" | awk '{print $2}')
else
    # ARM 아키텍처 (Raspberry Pi 등)
    cpu_fan=$(sensors | grep "pwmfan" | grep "fan1" | awk '{print $2}')
    case1_fan="N/A"
    case2_fan="N/A"
fi

# 프로세스 정보
processes=$(ps aux | sort -nrk 3,3 | head -n 6 | tail -n 5 | awk '{print $2 "," $3 "," $4 "," $11}')

# JSON 형식으로 출력
echo "{
    \"cpu\": {
        \"usage\": $cpu_usage,
        \"cores\": $cpu_cores,
        \"temperature\": ${cpu_temp:-"N/A"}
    },
    \"memory\": {
        \"used\": $memory_used,
        \"total\": $memory_total,
        \"percentage\": $memory_percentage
    },
    \"disk\": {
        \"used\": $disk_used,
        \"total\": $disk_total,
        \"percentage\": $disk_percentage
    },
    \"network\": {
        \"download\": $rx_mb,
        \"upload\": $tx_mb,
        \"ping\": 0,
        \"errorRates\": {
            \"rx\": $rx_errors,
            \"tx\": $tx_errors
        }
    },
    \"uptime\": {
        \"days\": $uptime_days,
        \"hours\": $uptime_hours,
        \"minutes\": $uptime_minutes
    },
    \"temperature\": {
        \"cpu\": ${cpu_temp:-"N/A"},
        \"gpu\": ${gpu_temp:-"N/A"},
        \"motherboard\": ${mb_temp:-"N/A"}
    },
    \"fan\": {
        \"cpu\": ${cpu_fan:-"N/A"},
        \"case1\": ${case1_fan:-"N/A"},
        \"case2\": ${case2_fan:-"N/A"}
    },
    \"processes\": ["

# 프로세스 정보를 JSON 배열로 변환
first=true
echo "$processes" | while IFS=',' read -r pid cpu mem cmd; do
    if [ "$first" = true ]; then
        first=false
    else
        echo ","
    fi
    echo "    {
        \"pid\": $pid,
        \"cpu\": $cpu,
        \"memory\": $mem,
        \"command\": \"$cmd\"
    }"
done

echo "    ]
}" 
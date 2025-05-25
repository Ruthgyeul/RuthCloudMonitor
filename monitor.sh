#!/bin/bash

# CPU 정보 수집
get_cpu_info() {
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    cpu_cores=$(nproc)
    
    # CPU 온도 (sensors가 설치되어 있지 않을 수 있으므로 에러 처리)
    if command -v sensors &> /dev/null; then
        cpu_temp=$(sensors | grep "Package id 0" | awk '{print $4}' | sed 's/+//' | sed 's/°C//' || echo "0")
    else
        cpu_temp="0"
    fi
    
    echo "{\"usage\":$cpu_usage,\"cores\":$cpu_cores,\"temperature\":$cpu_temp}"
}

# 메모리 정보 수집
get_memory_info() {
    memory_info=$(free -m | grep Mem)
    total=$(echo $memory_info | awk '{print $2}')
    used=$(echo $memory_info | awk '{print $3}')
    percentage=$(echo "scale=2; ($used/$total)*100" | bc)
    
    echo "{\"total\":$total,\"used\":$used,\"percentage\":$percentage}"
}

# 디스크 정보 수집
get_disk_info() {
    disk_info=$(df -h / | tail -1)
    total=$(echo $disk_info | awk '{print $2}' | sed 's/G//')
    used=$(echo $disk_info | awk '{print $3}' | sed 's/G//')
    percentage=$(echo $disk_info | awk '{print $5}' | sed 's/%//')
    
    echo "{\"total\":$total,\"used\":$used,\"percentage\":$percentage}"
}

# 네트워크 정보 수집
get_network_info() {
    # 네트워크 인터페이스 찾기 (eth0 또는 enp0s3 등)
    interface=$(ip route | grep default | awk '{print $5}' | head -n1)
    
    # 이전 값 저장
    if [ ! -f /tmp/network_stats ]; then
        rx_bytes_prev=0
        tx_bytes_prev=0
    else
        source /tmp/network_stats
    fi
    
    # 현재 값 읽기
    rx_bytes=$(cat /sys/class/net/$interface/statistics/rx_bytes)
    tx_bytes=$(cat /sys/class/net/$interface/statistics/tx_bytes)
    
    # 현재 값 저장
    echo "rx_bytes_prev=$rx_bytes" > /tmp/network_stats
    echo "tx_bytes_prev=$tx_bytes" >> /tmp/network_stats
    
    # 속도 계산 (바이트/초)
    rx_speed=$(( (rx_bytes - rx_bytes_prev) ))
    tx_speed=$(( (tx_bytes - tx_bytes_prev) ))
    
    # ping 테스트
    ping_result=$(ping -c 1 8.8.8.8 2>/dev/null | grep "time=" | awk '{print $7}' | sed 's/time=//' || echo "0")
    
    echo "{\"download\":$rx_speed,\"upload\":$tx_speed,\"ping\":$ping_result,\"errorRates\":{\"rx\":\"0\",\"tx\":\"0\"}}"
}

# 시스템 온도 정보 수집
get_temperature() {
    if command -v sensors &> /dev/null; then
        cpu_temp=$(sensors | grep "Package id 0" | awk '{print $4}' | sed 's/+//' | sed 's/°C//' || echo "0")
        mobo_temp=$(sensors | grep "temp1" | awk '{print $2}' | sed 's/+//' | sed 's/°C//' || echo "0")
    else
        cpu_temp="0"
        mobo_temp="0"
    fi
    
    # GPU 온도 (NVIDIA GPU가 있는 경우)
    if command -v nvidia-smi &> /dev/null; then
        gpu_temp=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits || echo "0")
    else
        gpu_temp="0"
    fi
    
    echo "{\"cpu\":$cpu_temp,\"gpu\":$gpu_temp,\"motherboard\":$mobo_temp}"
}

# 팬 속도 정보 수집
get_fan_speed() {
    if command -v sensors &> /dev/null; then
        cpu_fan=$(sensors | grep "fan1" | awk '{print $2}' || echo "0")
        case_fan1=$(sensors | grep "fan2" | awk '{print $2}' || echo "0")
        case_fan2=$(sensors | grep "fan3" | awk '{print $2}' || echo "0")
    else
        cpu_fan="0"
        case_fan1="0"
        case_fan2="0"
    fi
    
    echo "{\"cpu\":$cpu_fan,\"case1\":$case_fan1,\"case2\":$case_fan2}"
}

# 프로세스 정보 수집
get_processes() {
    processes=$(ps aux --sort=-%cpu | head -n 16 | tail -n 15 | awk '{print "{\"name\":\""$11"\",\"cpu\":"$3",\"memory\":"$4"}"}' | tr '\n' ',' | sed 's/,$//')
    echo "[$processes]"
}

# 업타임 정보 수집
get_uptime() {
    uptime_info=$(uptime -p)
    days=$(echo $uptime_info | grep -o '[0-9]* day' | awk '{print $1}' || echo "0")
    hours=$(echo $uptime_info | grep -o '[0-9]* hour' | awk '{print $1}' || echo "0")
    minutes=$(echo $uptime_info | grep -o '[0-9]* minute' | awk '{print $1}' || echo "0")
    
    echo "{\"days\":$days,\"hours\":$hours,\"minutes\":$minutes}"
}

# 모든 정보 수집 및 JSON 형식으로 출력
{
    echo "{"
    echo "  \"cpu\": $(get_cpu_info),"
    echo "  \"memory\": $(get_memory_info),"
    echo "  \"disk\": $(get_disk_info),"
    echo "  \"network\": $(get_network_info),"
    echo "  \"uptime\": $(get_uptime),"
    echo "  \"temperature\": $(get_temperature),"
    echo "  \"fan\": $(get_fan_speed),"
    echo "  \"processes\": $(get_processes)"
    echo "}"
} 
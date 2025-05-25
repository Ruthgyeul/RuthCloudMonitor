#!/bin/bash

# 에러 발생시 즉시 중단
set -e

# 필요한 명령어 확인
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "Error: $1 is not installed" >&2
        exit 1
    fi
}

# 기본 명령어 확인
check_command top
check_command free
check_command df
check_command ip
check_command ps

# 이전 네트워크 통계 저장 파일
NET_STATS_FILE="/tmp/network_stats.txt"

# CPU 정보 수집
get_cpu_info() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
    local cpu_cores=$(nproc)
    local cpu_temp=0
    
    # CPU 온도 확인 (sensors 명령어가 있는 경우)
    if command -v sensors &> /dev/null; then
        cpu_temp=$(sensors | grep "Core 0" | awk '{print $3}' | sed 's/+//' | sed 's/°C//')
    fi
    
    echo "{\"usage\":$cpu_usage,\"cores\":$cpu_cores,\"temperature\":$cpu_temp}"
}

# 메모리 정보 수집
get_memory_info() {
    local mem_info=$(free -m | grep Mem)
    local total=$(echo $mem_info | awk '{print $2}')
    local used=$(echo $mem_info | awk '{print $3}')
    local percentage=$(echo "scale=1; ($used/$total)*100" | bc)
    
    echo "{\"used\":$used,\"total\":$total,\"percentage\":$percentage}"
}

# 디스크 정보 수집
get_disk_info() {
    local disk_info=$(df -h / | tail -n 1)
    local total=$(echo $disk_info | awk '{print $2}' | sed 's/G//')
    local used=$(echo $disk_info | awk '{print $3}' | sed 's/G//')
    local percentage=$(echo $disk_info | awk '{print $5}' | sed 's/%//')
    
    echo "{\"used\":$used,\"total\":$total,\"percentage\":$percentage}"
}

# 네트워크 정보 수집
get_network_info() {
    local interface=$(ip route | grep default | awk '{print $5}')
    local rx_bytes=$(cat /sys/class/net/$interface/statistics/rx_bytes)
    local tx_bytes=$(cat /sys/class/net/$interface/statistics/tx_bytes)
    local rx_errors=$(cat /sys/class/net/$interface/statistics/rx_errors)
    local tx_errors=$(cat /sys/class/net/$interface/statistics/tx_errors)
    
    # 이전 통계 읽기
    local rx_bytes_prev=0
    local tx_bytes_prev=0
    if [ -f "$NET_STATS_FILE" ]; then
        read rx_bytes_prev tx_bytes_prev < "$NET_STATS_FILE"
    fi
    
    # 현재 통계 저장
    echo "$rx_bytes $tx_bytes" > "$NET_STATS_FILE"
    
    # 속도 계산 (KB/s)
    local rx_speed=0
    local tx_speed=0
    if [ $rx_bytes_prev -ne 0 ]; then
        rx_speed=$(echo "scale=2; ($rx_bytes - $rx_bytes_prev) / 1024" | bc)
    fi
    if [ $tx_bytes_prev -ne 0 ]; then
        tx_speed=$(echo "scale=2; ($tx_bytes - $tx_bytes_prev) / 1024" | bc)
    fi
    
    # ping 테스트
    local ping_result=0
    if command -v ping &> /dev/null; then
        ping_result=$(ping -c 1 8.8.8.8 | grep "time=" | awk '{print $7}' | sed 's/time=//')
    fi
    
    echo "{\"download\":$rx_speed,\"upload\":$tx_speed,\"ping\":$ping_result,\"errorRates\":{\"rx\":\"$rx_errors\",\"tx\":\"$tx_errors\"}}"
}

# 온도 정보 수집
get_temperature() {
    local cpu_temp=0
    local gpu_temp=0
    local mb_temp=0
    
    if command -v sensors &> /dev/null; then
        # CPU 온도
        cpu_temp=$(sensors | grep "Core 0" | awk '{print $3}' | sed 's/+//' | sed 's/°C//' || echo "0")
        
        # GPU 온도 (NVIDIA)
        if command -v nvidia-smi &> /dev/null; then
            gpu_temp=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader || echo "0")
        fi
        
        # 메인보드 온도
        mb_temp=$(sensors | grep "temp1" | awk '{print $2}' | sed 's/+//' | sed 's/°C//' || echo "0")
    fi
    
    echo "{\"cpu\":$cpu_temp,\"gpu\":$gpu_temp,\"motherboard\":$mb_temp}"
}

# 팬 속도 정보 수집
get_fan_speed() {
    local cpu_fan=0
    local case_fan1=0
    local case_fan2=0
    
    if command -v sensors &> /dev/null; then
        # CPU 팬
        if sensors | grep -q "fan1"; then
            cpu_fan=$(sensors | grep "fan1" | awk '{print $2}' | grep -E '^[0-9]+$' || echo "0")
        fi
        
        # 케이스 팬 1
        if sensors | grep -q "fan2"; then
            case_fan1=$(sensors | grep "fan2" | awk '{print $2}' | grep -E '^[0-9]+$' || echo "0")
        fi
        
        # 케이스 팬 2
        if sensors | grep -q "fan3"; then
            case_fan2=$(sensors | grep "fan3" | awk '{print $2}' | grep -E '^[0-9]+$' || echo "0")
        fi
    fi
    
    echo "{\"cpu\":$cpu_fan,\"case1\":$case_fan1,\"case2\":$case_fan2}"
}

# 프로세스 정보 수집
get_processes() {
    local processes=$(ps aux --sort=-%cpu | head -n 6 | tail -n 5 | awk '{print "{\"name\":\""$11"\",\"cpu\":"$3",\"memory\":"$4"}"}' | tr '\n' ',' | sed 's/,$//')
    echo "[$processes]"
}

# 시스템 가동 시간 수집
get_uptime() {
    local uptime_seconds=$(cat /proc/uptime | awk '{print $1}')
    local days=$(echo "scale=0; $uptime_seconds/86400" | bc)
    local hours=$(echo "scale=0; ($uptime_seconds%86400)/3600" | bc)
    local minutes=$(echo "scale=0; ($uptime_seconds%3600)/60" | bc)
    
    echo "{\"days\":$days,\"hours\":$hours,\"minutes\":$minutes}"
}

# 메인 함수
main() {
    echo "{"
    echo "\"cpu\":$(get_cpu_info),"
    echo "\"memory\":$(get_memory_info),"
    echo "\"disk\":$(get_disk_info),"
    echo "\"network\":$(get_network_info),"
    echo "\"uptime\":$(get_uptime),"
    echo "\"temperature\":$(get_temperature),"
    echo "\"fan\":$(get_fan_speed),"
    echo "\"processes\":$(get_processes)"
    echo "}"
}

# 스크립트 실행
main 
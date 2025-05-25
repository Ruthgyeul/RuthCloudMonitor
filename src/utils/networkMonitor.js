import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class NetworkMonitor {
    constructor() {
        this.previousStats = null;
        this.previousTimestamp = null;
    }

    async getNetworkInterface() {
        try {
            // 활성화된 네트워크 인터페이스 찾기
            const { stdout } = await execAsync('ip route get 8.8.8.8 | grep -oP "dev \\K\\w+"');
            return stdout.trim();
        } catch {
            // 기본 인터페이스들 시도
            const interfaces = ['eth0', 'enp0s3', 'wlan0', 'wlp2s0'];
            for (const iface of interfaces) {
                try {
                    await execAsync(`cat /sys/class/net/${iface}/operstate`);
                    return iface;
                } catch {
                    continue;
                }
            }
            return 'eth0'; // 기본값
        }
    }

    async getNetworkStats(interfaceName) {
        try {
            const rxPath = `/sys/class/net/${interfaceName}/statistics/rx_bytes`;
            const txPath = `/sys/class/net/${interfaceName}/statistics/tx_bytes`;

            const { stdout: rxBytes } = await execAsync(`cat ${rxPath}`);
            const { stdout: txBytes } = await execAsync(`cat ${txPath}`);

            return {
                rxBytes: parseInt(rxBytes.trim()),
                txBytes: parseInt(txBytes.trim()),
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`Failed to get network stats for ${interfaceName}: ${error.message}`);
        }
    }

    async getNetworkSpeed() {
        try {
            const interfaceName = await this.getNetworkInterface();
            const currentStats = await this.getNetworkStats(interfaceName);

            if (!this.previousStats) {
                this.previousStats = currentStats;
                this.previousTimestamp = currentStats.timestamp;
                // 첫 번째 호출에서는 잠시 대기 후 다시 측정
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.getNetworkSpeed();
            }

            const timeDiff = (currentStats.timestamp - this.previousTimestamp) / 1000; // 초
            const rxDiff = currentStats.rxBytes - this.previousStats.rxBytes;
            const txDiff = currentStats.txBytes - this.previousStats.txBytes;

            const downloadSpeed = (rxDiff / timeDiff) / (1024 * 1024); // MB/s
            const uploadSpeed = (txDiff / timeDiff) / (1024 * 1024); // MB/s

            // 다음 측정을 위해 현재 값을 저장
            this.previousStats = currentStats;
            this.previousTimestamp = currentStats.timestamp;

            return {
                download: Math.max(0, downloadSpeed),
                upload: Math.max(0, uploadSpeed),
                interface: interfaceName
            };
        } catch (error) {
            console.error('Network speed measurement error:', error);
            return { download: 0, upload: 0, interface: 'unknown' };
        }
    }

    async getPingLatency(host = '8.8.8.8') {
        try {
            const { stdout } = await execAsync(`ping -c 3 -W 2000 ${host} | grep 'avg' | awk -F'/' '{print $5}'`);
            return parseFloat(stdout.trim()) || 0;
        } catch (error) {
            console.error('Ping measurement error:', error);
            return 0;
        }
    }
}

// 싱글톤 인스턴스
const networkMonitor = new NetworkMonitor();

export default networkMonitor;
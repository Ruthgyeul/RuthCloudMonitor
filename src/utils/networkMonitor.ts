import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class NetworkMonitor {
    private lastRxBytes: number = 0;
    private lastTxBytes: number = 0;
    private lastCheckTime: number = Date.now();

    async getNetworkSpeed() {
        try {
            // Get network interface statistics using ifconfig
            const { stdout } = await execAsync('ifconfig | grep -A 5 "enp\\|eth0" | grep "RX bytes"');
            const rxMatch = stdout.match(/RX bytes:(\d+)/);
            const txMatch = stdout.match(/TX bytes:(\d+)/);

            const currentRxBytes = rxMatch ? parseInt(rxMatch[1]) : 0;
            const currentTxBytes = txMatch ? parseInt(txMatch[1]) : 0;
            const currentTime = Date.now();

            // Calculate time difference in seconds
            const timeDiff = (currentTime - this.lastCheckTime) / 1000;

            // Calculate speeds in Mbps
            const downloadSpeed = ((currentRxBytes - this.lastRxBytes) * 8) / (1024 * 1024 * timeDiff);
            const uploadSpeed = ((currentTxBytes - this.lastTxBytes) * 8) / (1024 * 1024 * timeDiff);

            // Get error rates using ifconfig
            const { stdout: errorStats } = await execAsync('ifconfig | grep -A 5 "enp\\|eth0" | grep "RX errors"');
            const rxErrors = errorStats.match(/RX errors:(\d+)/)?.[1] || '0';
            const txErrors = errorStats.match(/TX errors:(\d+)/)?.[1] || '0';

            // Update last values
            this.lastRxBytes = currentRxBytes;
            this.lastTxBytes = currentTxBytes;
            this.lastCheckTime = currentTime;

            return {
                download: Math.round(downloadSpeed * 100) / 100,
                upload: Math.round(uploadSpeed * 100) / 100,
                errorRates: {
                    rx: rxErrors,
                    tx: txErrors
                }
            };
        } catch (error) {
            console.error('Error getting network speed:', error);
            return {
                download: 0,
                upload: 0,
                errorRates: {
                    rx: '0',
                    tx: '0'
                }
            };
        }
    }

    async getPingLatency() {
        try {
            // Ping Google's DNS server (8.8.8.8) once
            const { stdout } = await execAsync('ping -c 1 8.8.8.8');
            const match = stdout.match(/time=(\d+\.?\d*) ms/);
            return match ? parseFloat(match[1]) : 0;
        } catch (error) {
            console.error('Error getting ping latency:', error);
            return 0;
        }
    }
}

export default new NetworkMonitor(); 
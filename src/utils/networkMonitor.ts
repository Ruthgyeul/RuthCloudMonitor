import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class NetworkMonitor {
    private lastRxBytes: number = 0;
    private lastTxBytes: number = 0;
    private lastCheckTime: number = Date.now();

    async getNetworkInterface() {
        try {
            // Try to get the primary network interface on Ubuntu
            const { stdout } = await execAsync("ip route | grep default | awk '{print $5}'");
            const networkInterface = stdout.trim();
            if (networkInterface) {
                return networkInterface;
            }
            
            // Fallback to checking common interface names
            const { stdout: interfaces } = await execAsync("ip link show | grep 'state UP' | awk -F': ' '{print $2}'");
            const interfaceList = interfaces.split('\n').filter(Boolean);
            
            // Try to find a non-loopback interface
            const nonLoopback = interfaceList.find(iface => iface !== 'lo');
            if (nonLoopback) {
                return nonLoopback;
            }
            
            return 'lo'; // Return loopback as last resort
        } catch (error) {
            console.error('Error getting network interface:', error);
            return 'lo';
        }
    }

    async getNetworkSpeed() {
        try {
            const networkInterface = await this.getNetworkInterface();
            
            // Get network statistics using ip command (more reliable on Ubuntu)
            const { stdout } = await execAsync(`ip -s link show ${networkInterface}`);
            const rxMatch = stdout.match(/RX: bytes\s+(\d+)/);
            const txMatch = stdout.match(/TX: bytes\s+(\d+)/);
            
            const currentRxBytes = rxMatch ? parseInt(rxMatch[1]) : 0;
            const currentTxBytes = txMatch ? parseInt(txMatch[1]) : 0;
            const currentTime = Date.now();

            // Calculate time difference in seconds
            const timeDiff = Math.max((currentTime - this.lastCheckTime) / 1000, 0.1); // Prevent division by zero

            // Calculate speeds in Mbps
            const downloadSpeed = ((currentRxBytes - this.lastRxBytes) * 8) / (1024 * 1024 * timeDiff);
            const uploadSpeed = ((currentTxBytes - this.lastTxBytes) * 8) / (1024 * 1024 * timeDiff);

            // Get error rates using ip command
            const rxErrors = stdout.match(/RX: errors\s+(\d+)/)?.[1] || '0';
            const txErrors = stdout.match(/TX: errors\s+(\d+)/)?.[1] || '0';

            // Update last values
            this.lastRxBytes = currentRxBytes;
            this.lastTxBytes = currentTxBytes;
            this.lastCheckTime = currentTime;

            return {
                download: Math.max(Math.round(downloadSpeed * 100) / 100, 0),
                upload: Math.max(Math.round(uploadSpeed * 100) / 100, 0),
                errorRates: {
                    rx: rxErrors,
                    tx: txErrors
                }
            };
        } catch (error) {
            console.error('Error getting network speed:', error);
            // Reset counters on error to prevent incorrect speed calculations
            this.lastRxBytes = 0;
            this.lastTxBytes = 0;
            this.lastCheckTime = Date.now();
            
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
            // Use Google's DNS server for ping test
            const { stdout } = await execAsync('ping -c 1 8.8.8.8');
            const match = stdout.match(/time=(\d+\.?\d*) ms/);
            return match ? Math.max(parseFloat(match[1]), 0) : 0;
        } catch (error) {
            console.error('Error getting ping latency:', error);
            return 0;
        }
    }
}

export default new NetworkMonitor(); 
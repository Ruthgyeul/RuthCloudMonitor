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
            // First try to get LAN interface
            const { stdout: lanInterface } = await execAsync("ip route get 8.8.8.8 | awk '{print $5}' | grep -E '^en|^eth'");
            if (lanInterface.trim()) {
                return lanInterface.trim();
            }
            
            // If no LAN interface found, try WiFi
            const { stdout: wifiInterface } = await execAsync("ip route get 8.8.8.8 | awk '{print $5}' | grep -E '^wl|^wlan'");
            if (wifiInterface.trim()) {
                return wifiInterface.trim();
            }
            
            // If no specific interface found, return the default route interface
            const { stdout: defaultInterface } = await execAsync("ip route get 8.8.8.8 | awk '{print $5}'");
            return defaultInterface.trim();
        } catch (error) {
            console.error('Error getting network interface:', error);
            return 'lo'; // Return loopback as fallback
        }
    }

    async getNetworkStats() {
        try {
            const networkInterface = await this.getNetworkInterface();
            const { stdout } = await execAsync(`netstat -i | grep ${networkInterface}`);
            const stats = stdout.split(/\s+/);
            
            return {
                interface: networkInterface,
                bytesIn: parseInt(stats[3]),
                bytesOut: parseInt(stats[7])
            };
        } catch (error) {
            console.error('Error getting network stats:', error);
            return {
                interface: 'unknown',
                bytesIn: 0,
                bytesOut: 0
            };
        }
    }

    async getNetworkSpeed() {
        try {
            const firstStats = await this.getNetworkStats();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const secondStats = await this.getNetworkStats();
            
            const downloadSpeed = (secondStats.bytesIn - firstStats.bytesIn) / 1024; // KB/s
            const uploadSpeed = (secondStats.bytesOut - firstStats.bytesOut) / 1024; // KB/s
            
            return {
                download: Math.round(downloadSpeed),
                upload: Math.round(uploadSpeed)
            };
        } catch (error) {
            console.error('Error getting network speed:', error);
            return {
                download: 0,
                upload: 0
            };
        }
    }

    async getPingLatency() {
        try {
            const { stdout } = await execAsync('ping -c 3 8.8.8.8 | grep "avg" | awk -F "/" \'{print $5}\'');
            return parseFloat(stdout.trim());
        } catch (error) {
            console.error('Error getting ping latency:', error);
            return 0;
        }
    }
}

// Singleton instance
const networkMonitor = new NetworkMonitor();

export default networkMonitor;
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
            // First try to get the default route interface
            const { stdout: defaultRoute } = await execAsync('route -n get default | grep interface | awk \'{print $2}\'');
            if (defaultRoute.trim()) {
                return defaultRoute.trim();
            }
        } catch (error) {
            console.log('Default route method failed, trying alternative methods...');
        }

        try {
            // Try to get active network interfaces
            const { stdout: interfaces } = await execAsync('networksetup -listallhardwareports | grep -A 1 "Wi-Fi\\|Ethernet" | grep "Device" | awk \'{print $2}\'');
            const interfaceList = interfaces.split('\n').filter(Boolean);
            
            // Return the first active interface
            if (interfaceList.length > 0) {
                return interfaceList[0].trim();
            }
        } catch (error) {
            console.log('Hardware ports method failed, trying ifconfig...');
        }

        try {
            // Try to get interface from ifconfig
            const { stdout: ifconfig } = await execAsync('ifconfig | grep -E "en[0-9]|eth[0-9]" | head -n 1 | awk \'{print $1}\'');
            if (ifconfig.trim()) {
                return ifconfig.trim();
            }
        } catch (error) {
            console.log('ifconfig method failed, using fallback...');
        }

        // If all methods fail, return a default interface
        console.log('Using fallback network interface');
        return 'en0'; // Default to en0 which is common on macOS
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
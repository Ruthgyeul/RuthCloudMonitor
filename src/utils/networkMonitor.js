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
            // First try to get Ethernet interface
            const { stdout: ethInterface } = await execAsync("ip link show | grep 'state UP' | grep 'enp' | awk -F': ' '{print $2}'");
            if (ethInterface.trim()) {
                return ethInterface.trim();
            }
            
            // Then try WiFi interface
            const { stdout: wifiInterface } = await execAsync("ip link show | grep 'state UP' | grep 'wlp' | awk -F': ' '{print $2}'");
            if (wifiInterface.trim()) {
                return wifiInterface.trim();
            }
            
            // If no specific interface found, return the first UP interface
            const { stdout: defaultInterface } = await execAsync("ip link show | grep 'state UP' | head -n 1 | awk -F': ' '{print $2}'");
            return defaultInterface.trim();
        } catch (error) {
            console.log('Error getting network interface:', error);
            return 'lo'; // Return loopback as fallback
        }
    }

    async getNetworkStats() {
        try {
            const networkInterface = await this.getNetworkInterface();
            
            // Get network statistics using netstat
            const { stdout } = await execAsync(`netstat -i | grep ${networkInterface}`);
            const stats = stdout.split(/\s+/);
            
            // netstat -i output format:
            // Iface MTU RX-OK RX-ERR RX-DRP RX-OVR TX-OK TX-ERR TX-DRP TX-OVR Flg
            return {
                interface: networkInterface,
                bytesIn: parseInt(stats[3] || '0'),  // RX-OK
                bytesOut: parseInt(stats[7] || '0'),  // TX-OK
                errors: {
                    rx: parseInt(stats[4] || '0'),    // RX-ERR
                    tx: parseInt(stats[8] || '0'),    // TX-ERR
                    rxDrop: parseInt(stats[5] || '0'), // RX-DRP
                    txDrop: parseInt(stats[9] || '0')  // TX-DRP
                }
            };
        } catch (error) {
            console.error('Error getting network stats:', error);
            return {
                interface: 'unknown',
                bytesIn: 0,
                bytesOut: 0,
                errors: {
                    rx: 0,
                    tx: 0,
                    rxDrop: 0,
                    txDrop: 0
                }
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
            
            // Calculate error rates
            const rxErrorRate = ((secondStats.errors.rx - firstStats.errors.rx) / 
                               (secondStats.bytesIn - firstStats.bytesIn)) * 100 || 0;
            const txErrorRate = ((secondStats.errors.tx - firstStats.errors.tx) / 
                               (secondStats.bytesOut - firstStats.bytesOut)) * 100 || 0;
            
            return {
                download: Math.round(downloadSpeed),
                upload: Math.round(uploadSpeed),
                errorRates: {
                    rx: rxErrorRate.toFixed(2),
                    tx: txErrorRate.toFixed(2)
                }
            };
        } catch (error) {
            console.error('Error getting network speed:', error);
            return {
                download: 0,
                upload: 0,
                errorRates: {
                    rx: '0.00',
                    tx: '0.00'
                }
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
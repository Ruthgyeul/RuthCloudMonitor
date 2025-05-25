import { ServerData } from '@/types/system';

export const generateMockServerData = (): ServerData => ({
  cpu: {
    usage: Math.floor(Math.random() * 100),
    cores: 8,
    temperature: Math.floor(Math.random() * 30) + 40,
  },
  memory: {
    used: Math.floor(Math.random() * 16),
    total: 16,
    percentage: Math.floor(Math.random() * 100),
  },
  disk: {
    used: Math.floor(Math.random() * 500),
    total: 1000,
    percentage: Math.floor(Math.random() * 100),
  },
  network: {
    download: Math.random() * 100,
    upload: Math.random() * 50,
    ping: Math.floor(Math.random() * 50) + 10,
  },
  uptime: {
    days: Math.floor(Math.random() * 30),
    hours: Math.floor(Math.random() * 24),
    minutes: Math.floor(Math.random() * 60),
  },
  temperature: {
    cpu: Math.floor(Math.random() * 30) + 40,
    gpu: Math.floor(Math.random() * 20) + 45,
    motherboard: Math.floor(Math.random() * 10) + 35,
  },
  fan: {
    cpu: Math.floor(Math.random() * 2000) + 1000,
    case1: Math.floor(Math.random() * 1500) + 800,
    case2: Math.floor(Math.random() * 1500) + 800,
  },
  processes: [
    {
      id: 1,
      name: 'node',
      cpu: Math.floor(Math.random() * 20),
      memory: Math.floor(Math.random() * 500) + 100,
      status: 'running',
    },
    {
      id: 2,
      name: 'nginx',
      cpu: Math.floor(Math.random() * 10),
      memory: Math.floor(Math.random() * 200) + 50,
      status: 'running',
    },
    {
      id: 3,
      name: 'mysql',
      cpu: Math.floor(Math.random() * 15),
      memory: Math.floor(Math.random() * 1000) + 200,
      status: 'running',
    },
  ],
}); 
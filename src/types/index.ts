import { LucideIcon } from 'lucide-react';

export interface Process {
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

export interface ServerData {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    download: number;
    upload: number;
    ping: number;
  };
  uptime: {
    days: number;
    hours: number;
    minutes: number;
  };
  temperature: {
    cpu: number;
    gpu: number;
    motherboard: number;
  };
  fan: {
    cpu: number;
    case1: number;
    case2: number;
  };
  processes: Process[];
}

export interface NetworkHistory {
  time: string;
  download: number;
  upload: number;
}

export interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  color?: string;
}

export interface PieChartCardProps {
  title: string;
  percentage: number;
  used: number | string;
  total: number | string;
  unit: string;
  icon: LucideIcon;
} 
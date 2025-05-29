import React, { useState, useEffect } from 'react';
import { Server } from 'lucide-react';

interface HeaderProps {
  error: string | null;
}

export const Header: React.FC<HeaderProps> = ({ error }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const time = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
      setCurrentTime(`${date} ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Server className="h-5 w-5 text-blue-400 mr-2" />
        <h1 className="text-lg font-bold">Server Monitor</h1>
        <div className="ml-2 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-300 font-mono">
          {currentTime}
        </div>
        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}; 
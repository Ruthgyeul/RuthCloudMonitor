import React, { useState, useEffect, useCallback } from 'react';
import { Server } from 'lucide-react';

interface HeaderProps {
  error: string | null;
}

export const Header: React.FC<HeaderProps> = React.memo(({ error }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  const updateTime = useCallback(() => {
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
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      setCurrentTime(''); // 컴포넌트 언마운트 시 상태 초기화
    };
  }, [updateTime]);

  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-2 sm:px-4">
      <div className="flex items-center min-w-0">
        <Server className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
        <h1 className="text-base sm:text-lg font-bold truncate">Server Monitor</h1>
        <div className="ml-2 w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="text-xs sm:text-sm text-gray-300 font-mono whitespace-nowrap">
          {currentTime}
        </div>
        {error && (
          <div className="text-red-400 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}); 
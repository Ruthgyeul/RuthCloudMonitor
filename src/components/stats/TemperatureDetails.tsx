import React from 'react';

interface TemperatureDetailsProps {
  temperature: {
    cpu: number;
    gpu: number;
    motherboard: number;
  };
}

export const TemperatureDetails: React.FC<TemperatureDetailsProps> = ({ temperature }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Temperature Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">CPU Temperature</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{temperature.cpu}°C</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">GPU Temperature</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{temperature.gpu}°C</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Motherboard Temperature</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{temperature.motherboard}°C</p>
        </div>
      </div>
    </div>
  );
}; 
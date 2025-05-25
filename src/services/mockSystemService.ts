import { SystemDataResponse } from '@/types/api';
import { generateMockServerData } from '@/mock/mockData';

export const getMockSystemData = (): SystemDataResponse => {
  return {
    serverData: generateMockServerData(),
    networkHistory: [],
  };
}; 
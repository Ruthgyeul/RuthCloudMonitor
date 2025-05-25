import { SystemDataResponse, ApiError } from '@/types/api';

const API_BASE_URL = '/api';

export const fetchSystemDataFromApi = async (): Promise<SystemDataResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/system`);
    
    if (!response.ok) {
      const error: ApiError = {
        message: 'Failed to fetch system data',
        code: String(response.status),
      };
      throw error;
    }
    
    const data = await response.json();
    return {
      serverData: data,
      networkHistory: [], // TODO: Implement network history API endpoint
    };
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
        code: 'UNKNOWN',
      } as ApiError;
    }
    throw error;
  }
}; 
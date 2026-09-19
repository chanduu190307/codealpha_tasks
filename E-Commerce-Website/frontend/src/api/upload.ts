import api from './client'
import type { ApiResponse } from '@/types'

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  format: string;
}

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<ApiResponse<UploadResult>>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },
}

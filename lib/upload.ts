import { UTApi } from 'uploadthing/server';

export const uploadApi = new UTApi();

export async function uploadToStorage(file: File) {
  const response = await uploadApi.uploadFiles(file);
  if (!response?.data) throw new Error('Upload failed');
  return { url: response.data.url };
}

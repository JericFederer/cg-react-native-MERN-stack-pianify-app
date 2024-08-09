import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';

import { AudioData } from '@/@types/audio';
import catchAsyncError from '@/api/catchError';
import client from '@/api/client';
import { updateNotification } from '@/store/notification';

const fetchLatest = async (): Promise<AudioData[]> => {
  const { data } = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  const fetchLatest = async () => {
    const { data } = await client('/audio/latest');
    return data.audios;
  };

  return fetchLatest
};

import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { updateNotification } from '@/store/notification';
import { AudioData } from '@/@types/audio';
import catchAsyncError from '@/api/catchError';
import client from '@/api/client';

const fetchLatest = async (): Promise<AudioData[]> => {
  const { data } = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['latest-uploads'],
    queryFn: () => fetchLatest()
  });
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const {data} = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['recommended'],
    queryFn: () => fetchRecommended()
  });
};

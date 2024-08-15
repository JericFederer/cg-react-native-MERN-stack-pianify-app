import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { updateNotification } from '@/store/notification';
import { AudioData, Playlist } from '@/@types/audio';
import catchAsyncError from '@/api/catchError';
import client, { getClient } from '@/api/client';
import { getFromAsyncStorage, Keys } from '@/utils/asyncStorage';

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
  const { data } = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['recommended'],
    queryFn: () => fetchRecommended()
  });
};

const fetchPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  const { data } = await client('/playlist/by-profile', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['playlist'],
    queryFn: () => fetchPlaylist()
  });
};

const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['uploads-by-profile'],
    queryFn: () => fetchUploadsByProfile()
  });
};

const fetchFavorites = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client('/favorite');
  return data.audios;
};

export const useFetchFavorite = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['favorite'],
    queryFn: () => fetchFavorites()
  });
};
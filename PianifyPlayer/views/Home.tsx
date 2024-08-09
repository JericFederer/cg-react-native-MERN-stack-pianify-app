import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';
import catchAsyncError from '@/api/catchError';
import client from '@/api/client';
import { updateNotification } from '@/store/notification';

interface Props {}

const fetchLatest = async () => {
  const { data } = await client('/audio/latest');
  return data.audios;
};

const Home: FC<Props> = props => {
  const dispatch = useDispatch();

  const { error, isLoading, data, refetch } = useQuery(
    {
        queryKey: ['latest-uploads'],
        queryFn: () => fetchLatest(),
    }
  );

  // * OLD WAY OF USING TANSTACK QUERY
  // const query = useQuery(
  //   ['latest-uploads'], {
  //     queryFn: () => fetchLatest(),
  //     onError(err) {
  //       const errorMessage = catchAsyncError(err);
  //       dispatch(updateNotification({ message: errorMessage, type: 'error' }));
  //     },
  //   }
  // );

  console.log(query);

  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;

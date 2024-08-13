import { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import LatestUploads from '@/components/LatestUploads';
import RecommendedAudios from '@/components/RecommendedAudios';

interface Props {}

const Home: FC<Props> = props => {
  return (
    <View style={ styles.container }>
      <LatestUploads />
      <RecommendedAudios />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Home;

import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import colors from '@/constants/colors';

interface Props {
  title: string;
}

const EmptyRecords: FC<Props> = ({ title }) => {
  return (
    <View style={ styles.container }>
      <Text style={ styles.title }>{ title }</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.INACTIVE_CONTRAST,
  },
});

export default EmptyRecords;

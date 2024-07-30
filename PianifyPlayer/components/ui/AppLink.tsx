import { FC } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';

import colors from '@/constants/colors';

interface Props {
  title: string;
  onPress?(): void;
}

const AppLink: FC<Props> = ({ title, onPress }) => {
  return (
    <Pressable onPress={ onPress }>
      <Text style={ styles.title }>{ title }</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
  },
});

export default AppLink;
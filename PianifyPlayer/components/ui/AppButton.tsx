import React, { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import colors from '../../constants/colors';

interface Props {
  title: string;
  customStyle?: object;
  onPress?(): void;
}

const AppButton: FC<Props> = ({ title, onPress, customStyle }) => {
  return (
    <Pressable onPress={ onPress } style={ [styles.container, customStyle] }>
      <Text style={ styles.title }>{ title }</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;

import { FC, ReactNode } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import colors from '@/constants/colors';

interface Props {
  size?: number;
  children: ReactNode;
  ignoreContainer?: boolean;
  onPress?(): void;
}

const PlayerController: FC<Props> = ({
  size = 45,
  ignoreContainer,
  children,
  onPress,
}) => {
  return (
    <Pressable
      onPress={ onPress }
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ignoreContainer ? 'transparent' : colors.CONTRAST,
      }}>
      { children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlayerController;

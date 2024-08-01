import { FC, ReactNode } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

import CircleUi from './ui/CircleUi';
import colors from '@/constants/colors';

interface Props {
  children: ReactNode;
  heading?: string;
  subHeading?: string;
}

const AuthFormContainer: FC<Props> = ({ children, heading, subHeading }) => {
  return (
    <View style={ styles.container }>
      <CircleUi position="top-left" size={200} />
      <CircleUi position="top-right" size={100} />
      <CircleUi position="bottom-left" size={100} />
      <CircleUi position="bottom-right" size={200} />

      <View style={ styles.headerContainer }>
        <Image
          source={ require('../assets/images/piano-logo.png') }
          style={ styles.image }
        />
        <Text style={ styles.heading }>{ heading }</Text>
        <Text style={ styles.subHeading }>{ subHeading }</Text>
      </View>

      { children }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subHeading: { color: colors.CONTRAST, fontSize: 16 },
  headerContainer: { width: '100%', marginBottom: "30%" },
  image: {
    height: "40%",
    width: 100,
    marginBottom: 5,
  }
});

export default AuthFormContainer;

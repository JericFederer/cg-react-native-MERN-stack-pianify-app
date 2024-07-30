import React, { FC, ReactNode, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useFormikContext } from 'formik';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import AppInput from '../ui/AppInput';
import colors from '../../constants/colors';

interface Props {
  name: string;
  label?: string;
  value?: string;
  errorMsg?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onChange?: (text: string) => void;
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
}

const AuthInputField: FC<Props> = props => {
  const inputTransformValue = useSharedValue(0);

  const { 
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  } = useFormikContext<{ [key: string]: string }>();

  const {
    label,
    placeholder,
    autoCapitalize,
    keyboardType,
    secureTextEntry,
    containerStyle,
    name,
    rightIcon,
    onRightIconPress,
  } = props;

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';
  
  const shakeUI = () => {
    inputTransformValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1
      })
    );
  };

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: inputTransformValue.value }]
    }
  });

  useEffect(() => {
    if(errorMsg) {
      shakeUI();
    }
  }, [errorMsg])

  return (
    <Animated.View style={ [containerStyle, inputStyle] }>
      <View style={ styles.labelContainer }>
        <Text style={ styles.label }>{ label }</Text>
        <Text style={ styles.errorMsg }>{ errorMsg }</Text>
      </View>
      <AppInput
        placeholder={ placeholder }
        keyboardType={ keyboardType }
        autoCapitalize={ autoCapitalize }
        secureTextEntry={ secureTextEntry }
        onChangeText={ handleChange(name) }
        value={ values[name] }
        onBlur={ handleBlur(name) }
      />
      { 
        rightIcon
        ? (
            <Pressable onPress={ onRightIconPress } style={ styles.rightIcon }>
              { rightIcon }
            </Pressable>
          )
        : null
      }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  label: {
    color: colors.CONTRAST,
  },
  errorMsg: {
    color: colors.ERROR,
  },
  rightIcon: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: 25,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthInputField;

import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/AntDesign';

import SubmitBtn from '@/components/form/SubmitBtn';
import AuthInputField from '../../components/form/AuthInputField';
import colors from '../../constants/colors';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing.')
    .min(3, 'Invalid name.')
    .required('Name is required.'),
  email: yup
    .string()
    .trim('Email is missing.')
    .email('Invalid email.')
    .required('Email is required.'),
  password: yup
    .string()
    .trim('Password is missing.')
    .min(8, 'Password is too short.')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password is too simple.',
    )
    .required('Password is required.'),
});

interface Props {}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  return (
    <SafeAreaView style={ styles.container }>
      <Formik
        onSubmit={ values => {
          console.log(values);
        }}
        initialValues={ initialValues }
        validationSchema={ signupSchema }
      >
        {
          ({ handleSubmit, handleChange, values, errors }) => {
            return (
              <View style={ styles.formContainer }>
                <AuthInputField
                  name="name"
                  placeholder="John Doe"
                  label="Name"
                  containerStyle={ styles.marginBottom }
                />
                <AuthInputField
                  name="email"
                  placeholder="john@email.com"
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerStyle={ styles.marginBottom }
                />
                <AuthInputField
                  name="password"
                  placeholder="********"
                  label="Password"
                  autoCapitalize="none"
                  secureTextEntry
                  containerStyle={ styles.marginBottom }
                />
                <SubmitBtn
                  title="Sign Up"
                  customStyle={{ marginTop: 50 }}
                />
                <Icon
                 name="stepforward"
                 color="white"
                 size={ 30 }
                />
              </View>
            );
          }
        }
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default SignUp;

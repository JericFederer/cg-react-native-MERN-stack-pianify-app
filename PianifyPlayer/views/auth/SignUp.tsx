import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
// import { Formik } from 'formik';
import * as yup from 'yup';

import SubmitBtn from '@/components/form/SubmitBtn';
import AuthInputField from '../../components/form/AuthInputField';
import colors from '../../constants/colors';
import PasswordVisibilityIcon from '@/components/ui/PasswordVisibilityIcon';
import AppLink from '@/components/ui/AppLink';
import CircleUi from '@/components/ui/CircleUi';
import AuthFormContainer from '@/components/AuthFormContainer';
import Form from '@/components/form';

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
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <Form
      onSubmit={ values => {
        console.log(values);
      }}
      initialValues={ initialValues }
      validationSchema={ signupSchema }
    >
      <AuthFormContainer
        heading="P i a n i f y"
        subHeading="Let's get started by creating your account."
      >
        <View style={ styles.formContainer }>
          <AuthInputField
            name="name"
            placeholder="Please enter your name"
            label="Name"
            containerStyle={ styles.marginBottom }
          />

          <AuthInputField
            name="email"
            placeholder="Please enter your email address"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={ styles.marginBottom }
          />

          <AuthInputField
            name="password"
            placeholder="Please enter your password"
            label="Password"
            autoCapitalize="none"
            secureTextEntry={ secureEntry }
            containerStyle={ styles.marginBottom }
            rightIcon={ <PasswordVisibilityIcon privateIcon={ secureEntry } /> }
            onRightIconPress={ togglePasswordView }
          />

          <SubmitBtn
            title="Sign Up"
            customStyle={{ marginTop: 30 }}
          />

          <View style={ styles.linkContainer }>
            <AppLink title="Sign In" />
            <AppLink title="Forgot Password" />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
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
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignUp;

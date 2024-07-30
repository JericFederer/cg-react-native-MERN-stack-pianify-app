import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

import AuthInputField from '@/components/form/AuthInputField';
import SubmitBtn from '@/components/form/SubmitBtn';
import PasswordVisibilityIcon from '@/components/ui/PasswordVisibilityIcon';
import AppLink from '@/components/ui/AppLink';
import AuthFormContainer from '@/components/AuthFormContainer';

const signinSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is missing!')
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

interface Props {}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <Formik
      onSubmit={
        values => {
          console.log(values);
        }
      }
      initialValues={ initialValues }
      validationSchema={ signinSchema }>
      <AuthFormContainer heading="Welcome back!">
        <View style={ styles.formContainer }>
          <AuthInputField
            name="email"
            placeholder="Please enter your email"
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
            rightIcon={ <PasswordVisibilityIcon privateIcon={ secureEntry } />}
            onRightIconPress={ togglePasswordView }
          />
          
          <SubmitBtn
            title="Sign In"
            customStyle={{ marginTop: 30 }}
          />

          <View style={ styles.linkContainer }>
            <AppLink title="Forgot Password" />
            <AppLink title="Sign up" />
          </View>
        </View>
      </AuthFormContainer>
    </Formik>
  );
};

const styles = StyleSheet.create({
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

export default SignIn;

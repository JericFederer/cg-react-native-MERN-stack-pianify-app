import { useDispatch } from 'react-redux';
import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FormikHelpers } from 'formik';
import Form from '@/components/form';
import * as yup from 'yup';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';
import { updateLoggedInState, updateProfile } from '@/store/auth';
import { Keys, saveToAsyncStorage } from '@/utils/asyncStorage';
import AuthInputField from '@/components/form/AuthInputField';
import SubmitBtn from '@/components/form/SubmitBtn';
import PasswordVisibilityIcon from '@/components/ui/PasswordVisibilityIcon';
import AppLink from '@/components/ui/AppLink';
import AuthFormContainer from '@/components/AuthFormContainer';
import client from '@/api/client';
import catchAsyncError from '@/api/catchError';
import { updateNotification } from '@/store/notification';

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

interface SignInUserInfo {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: SignInUserInfo,
    actions: FormikHelpers<SignInUserInfo>,
  ) => {
    actions.setSubmitting(true);
    try {
      const { data } = await client.post('/auth/sign-in', {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }

    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={ handleSubmit }
      initialValues={ initialValues }
      validationSchema={ signinSchema }>
      <AuthFormContainer
        heading="P i a n i f y"
        subHeading="Welcome back!"
      >
        <View style={ styles.formContainer }>
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
            title="Sign In"
            customStyle={{ marginTop: 30 }}
          />

          <View style={ styles.linkContainer }>
            <AppLink
              title="Forgot Password"
              onPress={
                () => {
                  navigation.navigate('LostPassword');
                }
              }
            />

            <AppLink
              title="Sign up"
              onPress={
                () => {
                  navigation.navigate('SignUp');
                }
              }
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
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

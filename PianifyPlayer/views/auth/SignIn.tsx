import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Form from '@/components/form';
import * as yup from 'yup';

import AuthInputField from '@/components/form/AuthInputField';
import SubmitBtn from '@/components/form/SubmitBtn';
import PasswordVisibilityIcon from '@/components/ui/PasswordVisibilityIcon';
import AppLink from '@/components/ui/AppLink';
import AuthFormContainer from '@/components/AuthFormContainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';

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
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <Form
      onSubmit={
        values => {
          console.log(values);
        }
      }
      initialValues={ initialValues }
      validationSchema={ signinSchema }
    >
      <AuthFormContainer
        heading="P i a n i f y"
        subHeading="Welcome back!"
      >
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
            <AppLink
              title="Forgot Password"
              onPress={
                () => {
                  navigation.navigate("LostPassword")
                }
              }
            />
            <AppLink
              title="Sign Up"
              onPress={
                () => {
                  navigation.navigate("SignUp")
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
  scroll: {
    flex: 1
  },
  formContainer: {
    flex: 1,
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

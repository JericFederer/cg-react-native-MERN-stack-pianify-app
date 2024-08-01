import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';

import AuthInputField from '@/components/form/AuthInputField';
import Form from '@/components/form';
import SubmitBtn from '@/components/form/SubmitBtn';
import AppLink from '@/components/ui/AppLink';
import AuthFormContainer from '@/components/AuthFormContainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing.')
    .email('Invalid email.')
    .required('Email is required.'),
});

interface Props {}

const initialValues = {
  email: '',
};

const LostPassword: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <Form
      onSubmit={values => {
        console.log(values);
      }}
      initialValues={ initialValues}
      validationSchema={ lostPasswordSchema }>
      <AuthFormContainer
        heading="Password Reset"
        subHeading="Oops, did you forget your password? Don't worry, we'll help you get back in">
        <View style={ styles.formContainer }>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={ styles.marginBottom }
          />

          <SubmitBtn
            title="Send Link"
            customStyle={{ marginTop: 30 }}
          />

          <View style={ styles.linkContainer }>
          <AppLink
              title="Sign In"
              onPress={
                () => {
                  navigation.navigate("SignIn")
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

export default LostPassword;

import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@/@types/navigation';
import { getAuthState } from '@/store/auth';
import LostPassword from '@/views/auth/LostPassword';
import SignIn from '@/views/auth/SignIn';
import SignUp from '@/views/auth/SignUp';
import Verification from '@/views/auth/Verification';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const authState = useSelector(getAuthState);
  console.log(authState)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={ SignIn } />
      <Stack.Screen name="SignUp" component={ SignUp } />
      <Stack.Screen name="LostPassword" component={ LostPassword } />
      <Stack.Screen name="Verification" component={ Verification } />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

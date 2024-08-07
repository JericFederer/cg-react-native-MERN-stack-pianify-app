import { View, StyleSheet, ScrollView } from 'react-native';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { getFromAsyncStorage, Keys } from '@/utils/asyncStorage';
import { getAuthState, updateBusyState, updateLoggedInState, updateProfile } from '@/store/auth';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import client from '@/api/client';
import colors from '@/constants/colors';
import Loader from '@/components/ui/Loader';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const AppNavigator: FC<Props> = props => {
  const { loggedIn, busy } = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));

      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          return dispatch(updateBusyState(false));
        }

        const { data } = await client.get('/auth/is-auth', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log('Auth error: ', error);
      }

      dispatch(updateBusyState(false));
    };

    fetchAuthInfo();
  }, []);

  return (
    
    <NavigationContainer
      independent={ true }
      theme={ AppTheme }
    >
      {
        busy
        ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: colors.OVERLAY,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}>
            <Loader />
          </View>
        )
        : null
      }
      {
        loggedIn ? <TabNavigator /> : <AuthNavigator />
      }
    </NavigationContainer>
  );
};

export default AppNavigator;

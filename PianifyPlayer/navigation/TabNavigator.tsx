import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from '@/views/Home';
import Profile from '@/views/Profile';
import Upload from '@/views/Upload';
import colors from '@/constants/colors';
import ProfileNavigator from '@/navigation/ProfileNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={ Home }
        options={{
          tabBarIcon: props => {
            return (
              <AntDesign name="home" size={ props.size } color={ props.color } />
            );
          },
          tabBarLabel: 'Home',
        }}  
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ ProfileNavigator }
        options={{
          tabBarIcon: props => {
            return (
              <AntDesign name="user" size={ props.size } color={ props.color } />
            );
          },
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={ Upload }
        options={{
          tabBarIcon: props => {
            return (
              <MaterialComIcon
                name="account-music-outline"
                size={ props.size }
                color={ props.color }
              />
            );
          },
          tabBarLabel: 'Upload',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

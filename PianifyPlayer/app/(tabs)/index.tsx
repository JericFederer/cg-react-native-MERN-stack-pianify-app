import { View, Text } from "react-native";
import type { StatusBarStyle } from 'react-native';

import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "@/navigation/AuthNavigator";

const App = () => {
  return (
    <NavigationContainer independent={ true }>
      <AuthNavigator />
    </NavigationContainer>
  )
}

export default App
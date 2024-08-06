import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import store from "@/store";
import AuthNavigator from "@/navigation/AuthNavigator";
import AppNavigator from "@/navigation";
import AppContainer from "@/components/AppContainer";

const App = () => {
  return (
    <Provider store={ store }>
      <AppContainer>
        <AppNavigator />
      </AppContainer>
    </Provider>
  )
}

export default App
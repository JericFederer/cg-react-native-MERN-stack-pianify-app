import React from "react";
import { Provider } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import store from "@/store";
import AppNavigator from "@/navigation";
import AppContainer from "@/components/AppContainer";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={ store }>
      <QueryClientProvider client={ queryClient }>
        <AppContainer>
          <AppNavigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App
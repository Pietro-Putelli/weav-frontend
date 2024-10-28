import React from "react";
import { NavigationProvider } from "react-native-navigation-hooks";
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import GestureHandlerWrapper from "./GestureHandlerWrapper";

const MainWrapper = ({ children, componentId }) => {
  return (
    <GestureHandlerWrapper>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<></>} persistor={persistor}>
            <NavigationProvider value={{ componentId }}>
              {children}
            </NavigationProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerWrapper>
  );
};

export default MainWrapper;

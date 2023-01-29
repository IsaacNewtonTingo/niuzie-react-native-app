import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigators/tab-navigator";

import { NativeBaseProvider, extendTheme } from "native-base";

import { CredentialsContext } from "./src/componets/context/credentials-context";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreAllLogs();

const newColorTheme = {
  brand: {
    900: "#02030C",
    800: "#12163b",
    700: "#lightBlue",
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  const [storedCredentials, setStoredCredentials] = useState("");

  useEffect(() => {
    checkLoginCredentials();
  }, []);

  const checkLoginCredentials = async () => {
    await SecureStore.getItemAsync("loginCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}
      >
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <TabNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </NativeBaseProvider>
      </CredentialsContext.Provider>
    </GestureHandlerRootView>
  );
}

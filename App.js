import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigators/tab-navigator";

import { NativeBaseProvider, extendTheme } from "native-base";
import AuthNav from "./src/navigators/auth-nav";

import { CredentialsContext } from "./src/componets/context/credentials-context";
import * as SecureStore from "expo-secure-store";

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

  const checkLoginCredentials = () => {
    SecureStore.getItemAsync("loginCredentials")
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
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </NativeBaseProvider>
    </CredentialsContext.Provider>
  );
}

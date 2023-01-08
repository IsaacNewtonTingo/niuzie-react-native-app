import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigators/tab-navigator";

import { NativeBaseProvider, extendTheme } from "native-base";
import AuthNav from "./src/navigators/auth-nav";

const newColorTheme = {
  brand: {
    900: "#02030C",
    800: "#12163b",
    700: "#lightBlue",
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <AuthNav />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

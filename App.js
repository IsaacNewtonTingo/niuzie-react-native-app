import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigators/tab-navigator";

import { NativeBaseProvider, Box } from "native-base";

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

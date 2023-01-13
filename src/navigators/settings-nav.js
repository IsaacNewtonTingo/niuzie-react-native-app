import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../componets/colors/colors";

import EditProfile from "../screens/general/profile/edit-profile";
import Profile from "../screens/general/profile/profile";
import Settings from "../screens/general/profile/settings";

const Stack = createNativeStackNavigator();

export default function SettingsNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.lightBlue,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.bar,
        },
      }}
    >
      <Stack.Screen options={{}} name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{
        headerTitle:"Edit profile"
      }} />
    </Stack.Navigator>
  );
}

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Notifications from "../screens/general/dashboard/notifications";
import NotificationDetails from "../screens/general/dashboard/notification-details";
import colors from "../componets/colors/colors";

const Stack = createNativeStackNavigator();

export default function NotificationsNav() {
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
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen
        name="NotificationDetails"
        component={NotificationDetails}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

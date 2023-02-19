import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotificationsScreen from "../screens/general/dashboard/notifications";
import NotificationDetails from "../screens/general/dashboard/notification-details";
import colors from "../componets/colors/colors";
import ProductDetails from "../screens/general/dashboard/product-details";
import AllReviews from "../screens/general/dashboard/all-reviews";

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
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="NotificationDetails"
        component={NotificationDetails}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="AllReviews"
        component={AllReviews}
        options={{
          headerTitle: "Reviews",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

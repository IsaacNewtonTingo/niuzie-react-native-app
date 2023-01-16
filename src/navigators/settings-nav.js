import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../componets/colors/colors";

import EditProfile from "../screens/general/profile/edit-profile";
import Profile from "../screens/general/profile/profile";
import Settings from "../screens/general/profile/settings";
import MyProducts from "../screens/general/profile/my-products";
import ProductDetails from "../screens/general/dashboard/product-details";
import ContactUs from "../screens/general/profile/contact-us";

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
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: "Edit profile",
        }}
      />
      <Stack.Screen
        name="MyProducts"
        component={MyProducts}
        options={{
          headerTitle: "My products",
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerTitle: "Contact us",
        }}
      />
    </Stack.Navigator>
  );
}

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Discover from "../screens/general/dashboard/discover";
import ProductDetails from "../screens/general/dashboard/product-details";
import UserProfile from "../screens/general/dashboard/user-profile";

const Stack = createNativeStackNavigator();

export default function HomeNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Discover" component={Discover} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

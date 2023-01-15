import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Discover from "../screens/general/dashboard/discover";
import ProductDetails from "../screens/general/dashboard/product-details";
import UserProfile from "../screens/general/dashboard/user-profile";
import colors from "../componets/colors/colors";

const Stack = createNativeStackNavigator();

export default function DiscoverNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerStyle: {
          backgroundColor: colors.bar,
        },
      }}
    >
      <Stack.Screen name="Discover" component={Discover} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

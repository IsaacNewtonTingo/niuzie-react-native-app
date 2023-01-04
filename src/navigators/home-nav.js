import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/general/dashboard/home";
import ProductDetails from "../screens/general/dashboard/product-details";
import Subcategories from "../screens/general/dashboard/subcategories";
import SubcategoryProducts from "../screens/general/dashboard/subcategory-products";
import UserProfile from "../screens/general/dashboard/user-profile";
import colors from "../componets/colors/colors";

const Stack = createNativeStackNavigator();

export default function HomeNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerStyle: {
          backgroundColor: colors.bar,
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Subcategories" component={Subcategories} />
      <Stack.Screen
        name="SubcategoryProducts"
        component={SubcategoryProducts}
      />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

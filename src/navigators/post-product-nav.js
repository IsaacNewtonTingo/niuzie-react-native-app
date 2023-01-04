import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostProduct from "../screens/seller/post-product";
import colors from "../componets/colors/colors";

const Stack = createNativeStackNavigator();

export default function PostProductNav() {
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
      <Stack.Screen
        name="PostProduct"
        component={PostProduct}
        options={{
          headerTitle: "Post product",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

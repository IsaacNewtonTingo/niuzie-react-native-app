import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostProduct from "../screens/seller/post-product";

const Stack = createNativeStackNavigator();

export default function PostProductNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostProduct" component={PostProduct} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

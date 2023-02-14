import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import PostProduct from "../screens/seller/post-product";
import colors from "../componets/colors/colors";
import PostProductRequest from "../screens/buyer/post-product-request";
import PostOptions from "../screens/general/dashboard/post-options";
import PayForProduct from "../screens/seller/pay-product";
import ProductDetails from "../screens/general/dashboard/product-details";
import PendingProducts from "../screens/seller/pending-products";

const Stack = createNativeStackNavigator();

export default function PostProductNav({ navigation }) {
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
        name="PostOptions"
        component={PostOptions}
        options={{
          headerTitle: "Post options",
        }}
      />

      <Stack.Screen
        name="PostProductRequest"
        component={PostProductRequest}
        options={{
          headerTitle: "Post product request",
        }}
      />

      <Stack.Screen
        name="PostProduct"
        component={PostProduct}
        options={{
          headerTitle: "Post product",
          headerRight: (props) => (
            <TouchableOpacity
              style={pendingStyles.rightCont}
              onPress={() => navigation.navigate("PendingProducts")}
              {...props}
            >
              <AntDesign name="shoppingcart" size={25} color={colors.orange} />

              <View style={pendingStyles.pendingCountContainer}>
                <Text style={pendingStyles.pendingCountText}>0</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="PayForProduct"
        component={PayForProduct}
        options={{
          headerTitle: "Pay for product(s)",
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="PendingProducts"
        component={PendingProducts}
        options={({ route }) => ({
          headerTitle: "Pending products",
        })}
      />
    </Stack.Navigator>
  );
}

const pendingStyles = StyleSheet.create({
  rightCont: {
    flexDirection: "row",
  },
  pendingCountContainer: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  pendingCountText: {
    color: colors.lightBlue,
    fontSize: 12,
  },
});

import React from "react";
import Discover from "../screens/general/dashboard/discover";
import ProductDetails from "../screens/general/dashboard/product-details";
import UserProfile from "../screens/general/dashboard/user-profile";
import colors from "../componets/colors/colors";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProduct from "../screens/seller/edit-product";
import PublicProfile from "../screens/general/dashboard/public-profile";

const Stack = createNativeStackNavigator();

export default function DiscoverNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerTintColor: colors.lightBlue,
        headerStyle: {
          backgroundColor: colors.bar,
        },
      }}
    >
      <Stack.Screen
        name="Discover"
        component={Discover}
        options={({ route }) => ({
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={({ route }) => ({
          title: route.params.productName,
        })}
      />

      <Stack.Screen name="UserProfile" component={UserProfile} />

      <Stack.Screen
        name="PublicProfile"
        component={PublicProfile}
        options={{
          headerTitle: "Profile",
        }}
      />
    </Stack.Navigator>
  );
}

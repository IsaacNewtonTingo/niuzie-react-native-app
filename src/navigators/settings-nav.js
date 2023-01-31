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
import SavedProducts from "../screens/general/profile/saved-products";
import PremiumServices from "../screens/general/profile/premium-services";
import Payments from "../screens/general/profile/payments";
import Support from "../screens/general/profile/support";
import AdminDashboard from "../screens/admin/dashboard/admin-dashboard";

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
      <Stack.Screen
        options={
          {
            // headerShown: false,
          }
        }
        name="Settings"
        component={Settings}
      />
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

      <Stack.Screen
        name="SavedProducts"
        component={SavedProducts}
        options={{
          headerTitle: "Saved items",
        }}
      />

      <Stack.Screen
        name="PremiumServices"
        component={PremiumServices}
        options={{
          headerTitle: "Premium services",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Payments"
        component={Payments}
        options={{
          headerTitle: "Transactions",
        }}
      />

      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          headerTitle: "Support",
        }}
      />

      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          headerTitle: "Admin dashboard",
        }}
      />
    </Stack.Navigator>
  );
}

import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../componets/colors/colors";

import AdminDashboard from "../screens/admin/dashboard/admin-dashboard";
import Products from "../screens/admin/dashboard/products";
import Messages from "../screens/admin/dashboard/messages";
import AdminProfile from "../screens/admin/dashboard/admin-profile";
import AdminProductDetails from "../screens/admin/dashboard/product-details";
import EditAdminProfile from "../screens/admin/dashboard/edit-profile";
import AddCategories from "../screens/admin/dashboard/add-categories";
import SubCategoriesAdmin from "../screens/admin/dashboard/subcategories";

const Stack = createNativeStackNavigator();

export default function AdminNav() {
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
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          headerTitle: "Admin dashboard",
        }}
      />

      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          headerTitle: "Products",
        }}
      />

      <Stack.Screen
        name="SubCategoriesAdmin"
        component={SubCategoriesAdmin}
        options={({ route }) => ({
          title: route.params.categoryName,
        })}
      />

      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          headerTitle: "Messages",
        }}
      />

      <Stack.Screen
        name="AdminProfile"
        component={AdminProfile}
        options={{
          headerTitle: "Profile",
        }}
      />

      <Stack.Screen
        name="AdminProductDetails"
        component={AdminProductDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EditAdminProfile"
        component={EditAdminProfile}
        options={{
          headerTitle: "Edit profile",
        }}
      />

      <Stack.Screen
        name="AddCategories"
        component={AddCategories}
        options={{
          headerTitle: "Categories",
        }}
      />
    </Stack.Navigator>
  );
}

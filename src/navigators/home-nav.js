import { Image } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/general/dashboard/home";
import ProductDetails from "../screens/general/dashboard/product-details";
import Subcategories from "../screens/general/dashboard/subcategories";
import SubcategoryProducts from "../screens/general/dashboard/subcategory-products";
import UserProfile from "../screens/general/dashboard/user-profile";
import colors from "../componets/colors/colors";
import ProductRequestDetails from "../screens/general/dashboard/product-request-details";
import EditProduct from "../screens/seller/edit-product";

const Stack = createNativeStackNavigator();

function Logo() {
  return (
    <Image
      style={{ width: 100, height: 25, resizeMode: "contain" }}
      source={require("../assets/images/niuzie-logo.png")}
    />
  );
}

export default function HomeNav() {
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
        options={{
          title: "",
          headerTitle: (props) => <Logo {...props} />,
        }}
        name="Home"
        component={Home}
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

      <Stack.Screen
        options={({ route }) => ({
          title: route.params.categoryName,
        })}
        name="Subcategories"
        component={Subcategories}
      />

      <Stack.Screen
        options={({ route }) => ({
          title: route.params.subCategoryName,
        })}
        name="SubcategoryProducts"
        component={SubcategoryProducts}
      />

      <Stack.Screen name="UserProfile" component={UserProfile} />

      <Stack.Screen
        name="ProductRequestDetails"
        component={ProductRequestDetails}
        options={{
          headerTitle: "Product request",
        }}
      />
    </Stack.Navigator>
  );
}

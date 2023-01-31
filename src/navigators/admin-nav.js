import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../componets/colors/colors";

import AdminDashboard from "../screens/admin/dashboard/admin-dashboard";

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
    </Stack.Navigator>
  );
}

import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/general/auth/signup";
import Login from "../screens/general/auth/login";
import PhoneOtp from "../screens/general/auth/phone-otp";
import ResetPassword from "../screens/general/auth/reset-password";
import colors from "../componets/colors/colors";
import ConfirmOtp from "../screens/general/auth/phone-otp";
import CancelAuth from "../componets/buttons/cancel-auth";

const Stack = createNativeStackNavigator();

export default function AuthNav() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTintColor: colors.lightBlue,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.bar,
        },
        headerRight: () => <CancelAuth />,
      }}
    >
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerTitle: "Signup",
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: "Login",
        }}
      />

      <Stack.Screen
        name="ConfirmOtp"
        component={ConfirmOtp}
        options={{
          headerTitle: "Verify phone number",
        }}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerTitle: "Reset password",
        }}
      />
    </Stack.Navigator>
  );
}

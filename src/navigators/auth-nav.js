import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/general/auth/signup";
import Login from "../screens/general/auth/login";
import PhoneOtp from "../screens/general/auth/phone-otp";
import EmailOtp from "../screens/general/auth/email-otp";
import ResetPassword from "../screens/general/auth/reset-password";
import colors from "../componets/colors/colors";

const Stack = createNativeStackNavigator();

export default function AuthNav() {
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
        name="PhoneOtp"
        component={PhoneOtp}
        options={{
          headerTitle: "Verify phone number",
        }}
      />

      <Stack.Screen name="EmailOtp" component={EmailOtp} />

      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}

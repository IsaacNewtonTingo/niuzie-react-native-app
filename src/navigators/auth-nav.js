// In App.js in a new project

import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/general/auth/signup";
import Login from "../screens/general/auth/login";
import PhoneOtp from "../screens/general/auth/phone-otp";
import EmailOtp from "../screens/general/auth/email-otp";
import ResetPassword from "../screens/general/auth/reset-password";

const Stack = createNativeStackNavigator();

export default function AuthNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PhoneOtp" component={PhoneOtp} />
      <Stack.Screen name="EmailOtp" component={EmailOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}

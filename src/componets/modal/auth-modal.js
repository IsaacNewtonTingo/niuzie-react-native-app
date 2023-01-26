import { StyleSheet, Text, ScrollView } from "react-native";
import React from "react";
import LoginComponent from "../auth/login";

import { Modal } from "native-base";
import colors from "../colors/colors";
import { useState } from "react";
import SignUpComponent from "../auth/signup";

export default function AuthModal() {
  const [loginComp, setLoginComp] = useState(true);
  const [signupComp, setSignupComp] = useState(false);

  function switchToSignup() {
    setLoginComp(false);
    setSignupComp(true);
  }

  function switchToLogin() {
    setLoginComp(true);
    setSignupComp(false);
  }

  return (
    <Modal backgroundColor={colors.almostDark} width="100%" isOpen={true}>
      {loginComp == true ? (
        <LoginComponent onSignupPress={switchToSignup} />
      ) : signupComp == true ? (
        <SignUpComponent onLoginPress={switchToLogin} />
      ) : (
        <></>
      )}
    </Modal>
  );
}

const authStyles = StyleSheet.create({});

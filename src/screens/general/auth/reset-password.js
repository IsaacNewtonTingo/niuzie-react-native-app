import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../../../componets/styles/global-styles";

export default function ResetPassword() {
  return (
    <KeyboardAwareScrollView style={styles.container}></KeyboardAwareScrollView>
  );
}

const resetStyles = StyleSheet.create({});

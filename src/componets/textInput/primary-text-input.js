import { StyleSheet, TextInput, Text, View } from "react-native";
import React from "react";
import styles from "../styles/global-styles";

export default function PrimaryTextInput(props) {
  const value = props.value;
  const onChangeText = props.onChangeText;
  const keyboardType = props.keyboardType;
  const maxLength = props.maxLength;

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      maxLength={maxLength}
      keyboardType={keyboardType}
      style={styles.textInput}
    />
  );
}

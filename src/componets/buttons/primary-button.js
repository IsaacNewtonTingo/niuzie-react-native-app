import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../colors/colors";
import { BarIndicator } from "react-native-indicators";

export default function PrimaryButton(props) {
  const title = props.buttonTitle;
  const onPress = props.onPress;
  const disabled = props.disabled;
  const submitting = props.submitting;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        width: "100%",
        height: 50,
        borderRadius: 10,
        backgroundColor: "#0066FF",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      {submitting == true ? (
        <BarIndicator size={20} color="white" />
      ) : (
        <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

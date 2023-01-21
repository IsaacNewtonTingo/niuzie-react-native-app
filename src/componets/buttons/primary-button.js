import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarIndicator } from "react-native-indicators";

import colors from "../colors/colors";

export default function PrimaryButton(props) {
  const title = props.buttonTitle;
  const onPress = props.onPress;
  const disabled = props.disabled;
  const submitting = props.submitting;
  const style = props.style;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          width: "100%",
          height: 50,
          borderRadius: 10,
          backgroundColor: "#669999",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        },
        style,
      ]}
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

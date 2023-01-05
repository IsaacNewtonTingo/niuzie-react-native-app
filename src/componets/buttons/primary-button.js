import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../colors/colors";

export default function PrimaryButton(props) {
  const title = props.buttonTitle;
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 50,
        borderRadius: 10,
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

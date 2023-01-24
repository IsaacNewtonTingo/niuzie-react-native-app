import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../colors/colors";

export default function NoData(props) {
  const text = props.text;
  return (
    <Text
      style={{
        color: colors.gray,
        fontWeight: "800",
        textAlign: "center",
        position: "absolute",
        top: "50%",
        alignSelf: "center",
      }}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../colors/colors";

import { FontAwesome } from "@expo/vector-icons";

export default function SecondaryButton(props) {
  const title = props.buttonTitle;
  const iconName = props.iconName;

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.bar,
        flexDirection: "row",
        marginVertical: 10,
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <FontAwesome name={iconName} size={16} color={colors.gray} />
      <Text style={{ color: colors.gray, fontWeight: "800", marginLeft: 10 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

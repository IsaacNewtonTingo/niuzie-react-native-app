import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../colors/colors";

import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PromotedCard() {
  return (
    <View
      style={{
        borderRadius: 10,
        position: "absolute",
        zIndex: 1,
        top: 10,
        left: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons
        name="diamond-stone"
        size={16}
        color={colors.orange}
      />
    </View>
  );
}

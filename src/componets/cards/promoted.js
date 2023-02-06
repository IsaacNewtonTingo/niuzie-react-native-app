import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../colors/colors";

import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PromotedCard() {
  return (
    <View
      style={{
        borderRadius: 50,
        position: "absolute",
        zIndex: 1,
        top: 10,
        left: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.dark,
        padding: 5,
      }}
    >
      <MaterialCommunityIcons
        name="diamond-stone"
        size={20}
        color={colors.orange}
      />
    </View>
  );
}

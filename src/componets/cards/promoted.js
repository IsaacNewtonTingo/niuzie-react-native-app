import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../colors/colors";

export default function PromotedCard() {
  return (
    <View
      style={{
        width: 60,
        height: 25,
        borderRadius: 10,
        backgroundColor: "rgba(18, 22, 59,0.3)",
        position: "absolute",
        zIndex: 1,
        top: 10,
        left: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{ color: colors.lightBlue, fontSize: 10, fontWeight: "600" }}
      >
        Promoted
      </Text>
    </View>
  );
}

import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import colors from "../colors/colors";

const { width } = Dimensions.get("window");

import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminAction(props) {
  return (
    <TouchableOpacity style={adminActionStyles.card} onPress={props.onPress}>
      <LinearGradient
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        // locations={[0.0, 0.5, 1.0]}
        colors={[colors.dark, colors.cardColor, colors.dark]}
      >
        {props.item.iconType == "FontAwesome" ? (
          <FontAwesome
            name={props.item.iconName}
            size={24}
            color={colors.gray}
          />
        ) : (
          <MaterialCommunityIcons
            name={props.item.iconName}
            size={24}
            color={colors.gray}
          />
        )}
        <Text
          style={{
            color: colors.lightBlue,
            fontWeight: "800",
            marginTop: 10,
          }}
        >
          {props.item.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const adminActionStyles = StyleSheet.create({
  card: {
    width: width / 2.5,
    height: width / 2.5,
    borderRadius: 10,
    marginBottom: 20,
  },
});

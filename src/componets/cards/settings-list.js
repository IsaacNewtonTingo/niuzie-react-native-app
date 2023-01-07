import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import colors from "../colors/colors";

export default function SettingsList(props) {
  const title = props.title;
  const iconType = props.iconType;
  const iconName = props.iconName;

  return (
    <TouchableOpacity style={settingsListStyles.btn}>
      <View style={settingsListStyles.close}>
        {iconType == "FontAwesome5" ? (
          <FontAwesome5 name={iconName} size={16} color={colors.gray} />
        ) : iconType == "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons
            name={iconName}
            size={16}
            color={colors.gray}
          />
        ) : iconType == "MaterialIcons" ? (
          <MaterialIcons name={iconName} size={16} color={colors.gray} />
        ) : iconType == "AntDesign" ? (
          <AntDesign name={iconName} size={16} color={colors.gray} />
        ) : (
          <FontAwesome name={iconName} size={16} color={colors.gray} />
        )}

        <Text style={settingsListStyles.text}>{title}</Text>
      </View>

      <AntDesign name="right" size={16} color={colors.gray} />
    </TouchableOpacity>
  );
}

export const settingsListStyles = StyleSheet.create({
  btn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
    backgroundColor: colors.dark,
    borderRadius: 10,
    paddingHorizontal: 40,
    borderBottomColor: "#070b2c",
    borderBottomWidth: 0.5,
  },
  text: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginLeft: 20,
  },
  close: { flexDirection: "row", alignItems: "center" },
});

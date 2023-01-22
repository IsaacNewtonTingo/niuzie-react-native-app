import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import colors from "../colors/colors";

export default function FilterList(props) {
  const title = props.title;
  const iconType = props.iconType;
  const iconName = props.iconName;
  const onPress = props.onPress;
  const filterDetail = props.filterDetail;

  return (
    <TouchableOpacity onPress={onPress} style={FilterListStyles.btn}>
      <View style={FilterListStyles.close}>
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
        ) : iconType == "Ionicons" ? (
          <Ionicons name={iconName} size={16} color={colors.gray} />
        ) : (
          <FontAwesome name={iconName} size={16} color={colors.gray} />
        )}

        <Text style={FilterListStyles.text}>{title}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={FilterListStyles.textTwo}>{filterDetail}</Text>
        <AntDesign name="right" size={16} color={colors.gray} />
      </View>
    </TouchableOpacity>
  );
}

export const FilterListStyles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
    borderRadius: 10,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.2,
  },
  text: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginLeft: 20,
  },
  textTwo: {
    color: colors.gray,
    fontWeight: "800",
    marginRight: 20,
  },
  close: { flexDirection: "row", alignItems: "center" },
});

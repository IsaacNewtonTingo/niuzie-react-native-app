import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";

import { settingsListStyles } from "../cards/settings-list";
import colors from "../colors/colors";

export default function SubCategoryList(props) {
  const subCategoryName = props.subCategoryName;
  const onPress = props.onPress;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[settingsListStyles.btn, { paddingHorizontal: 20 }, props.style]}
    >
      <Text style={settingsListStyles.text}>{subCategoryName}</Text>
      <AntDesign name="right" size={16} color={colors.gray} />
    </TouchableOpacity>
  );
}

const subStyles = StyleSheet.create({});

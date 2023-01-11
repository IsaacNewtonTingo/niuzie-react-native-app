import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";

import { settingsListStyles } from "../cards/settings-list";
import colors from "../colors/colors";

export default function PostSubCategoryList(props) {
  const subCategoryName = props.subCategoryName;
  const onPress = props.onPress;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#d3d6f8",
      }}
    >
      <Text style={{ color: colors.dark, fontWeight: "800" }}>
        {subCategoryName}
      </Text>
      <AntDesign name="right" size={16} color={colors.gray} />
    </TouchableOpacity>
  );
}

const subStyles = StyleSheet.create({});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";

import { settingsListStyles } from "../cards/settings-list";
import colors from "../colors/colors";

export default function PostSubCategoryList(props) {
  const subCategoryName = props.subCategoryName;
  const itemKey = props.itemKey;
  const onPress = props.onPress;

  return (
    <TouchableOpacity
      onPress={onPress}
      key={itemKey}
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 20,
        borderBottomWidth: 0.2,
        borderBottomColor: "#538cc6",
      }}
    >
      <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
        {subCategoryName}
      </Text>
      <AntDesign name="right" size={16} color={colors.gray} />
    </TouchableOpacity>
  );
}

const subStyles = StyleSheet.create({});

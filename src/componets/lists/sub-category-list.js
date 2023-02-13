import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";

import { settingsListStyles } from "../cards/settings-list";
import colors from "../colors/colors";
import { LinearGradient } from "expo-linear-gradient";

export default function SubCategoryList(props) {
  const subCategoryName = props.subCategoryName;
  const onPress = props.onPress;

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={[settingsListStyles.btn, { paddingHorizontal: 0 }]}
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        // locations={[0.0, 0.5, 1.0]}
        colors={[colors.dark, colors.cardColor, colors.dark]}
      >
        <Text style={settingsListStyles.text}>{subCategoryName}</Text>
        <AntDesign name="right" size={16} color={colors.gray} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const subStyles = StyleSheet.create({});

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import colors from "../colors/colors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function SettingsList(props) {
  const title = props.title;
  const iconType = props.iconType;
  const iconName = props.iconName;
  const onPress = props.onPress;

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={settingsListStyles.btn}
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        locations={[0.0, 1.0]}
        colors={[colors.dark, colors.cardColor]}
      >
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
      </LinearGradient>
    </TouchableOpacity>
  );
}

export const settingsListStyles = StyleSheet.create({
  btn: {
    width: width - 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 70,
    backgroundColor: colors.cardColor,
    borderRadius: 10,
    paddingHorizontal: 40,
    borderBottomColor: colors.almostDark,
    borderBottomWidth: 0.5,
    marginBottom: 10,
    alignSelf: "center",
  },
  text: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginLeft: 20,
  },
  close: { flexDirection: "row", alignItems: "center" },
});

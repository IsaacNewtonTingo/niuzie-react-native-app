import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../colors/colors";

export default function PendingIcon({ navigation }, props) {
  return (
    <TouchableOpacity style={pendingStyles.pendingBTN} onPress={props.onPress}>
      <FontAwesome5 name="luggage-cart" size={20} color={colors.orange} />
    </TouchableOpacity>
  );
}

const pendingStyles = StyleSheet.create({
  pendingBTN: {},
});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
import colors from "../colors/colors";

const B = (props) => (
  <Text style={{ color: colors.gray }}>{props.children}</Text>
);

export default function Admins(props) {
  const { firstName, lastName, phoneNumber, onPress } = props;
  return (
    <View style={adminsStyles.container}>
      <Text style={adminsStyles.text}>
        {firstName} {lastName} ~{" "}
        <B>{"0" + phoneNumber.toString().substring(3)}</B>
      </Text>

      <TouchableOpacity onPress={onPress}>
        <AntDesign name="delete" size={20} color={colors.orange} />
      </TouchableOpacity>
    </View>
  );
}

const adminsStyles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.gray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: colors.lightBlue,
    fontWeight: "800",
  },
});

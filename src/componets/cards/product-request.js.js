import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";

export default function ProductRequest(props) {
  const userName = props.item.firstName + " " + props.item.lastName;
  const profilePicture = props.item.profilePicture;
  const content = props.item.content;
  const location = props.item.county + " " + props.item.cubCounty;
  const date = props.item.date;

  return (
    <>
      <LinearGradient
        // Button Linear Gradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={gradientStyles.background}
      >
        <Text>{userName}</Text>
        <Text>{profilePicture}</Text>
        <Text>{content}</Text>
        <Text>{location}</Text>
        <Text>{date}</Text>
      </LinearGradient>
    </>
  );
}

const gradientStyles = StyleSheet.create({
  background: {
    height: 100,
  },
});

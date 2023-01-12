import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import styles from "../../../componets/styles/global-styles";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  return (
    <ScrollView style={[styles.container, { padding: 20 }]}>
      <LinearGradient
        style={profileStyles.detailsContainer}
        colors={["#78869F", "#001949"]}
      >
        <Image
          source={require("../../../assets/images/tabs.jpg")}
          style={profileStyles.image}
        />
      </LinearGradient>
    </ScrollView>
  );
}

const profileStyles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  detailsContainer: {
    width: "100%",
    borderRadius: 10,
  },
});

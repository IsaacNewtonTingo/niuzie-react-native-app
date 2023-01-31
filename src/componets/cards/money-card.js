import { ImageBackground, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../colors/colors";

const { width } = Dimensions.get("window");

export default function MoneyCard({ children }) {
  return (
    <LinearGradient
      start={[0.0, 0.5]}
      end={[1.0, 0.5]}
      locations={[0.0, 1.0]}
      colors={[colors.dark, "#001949"]}
      style={moneyStyles.moneyCard}
    >
      <ImageBackground
        style={moneyStyles.imageBackground}
        source={require("../../assets/images/money-bg.png")}
      >
        {children}
      </ImageBackground>
    </LinearGradient>
  );
}

const moneyStyles = StyleSheet.create({
  moneyCard: {
    width: width - 40,
    alignSelf: "center",
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
});

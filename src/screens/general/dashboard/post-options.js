import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../../../componets/styles/global-styles";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

export default function PostOptions({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[colors.almostDark, colors.dark]}
        style={{
          paddingVertical: 40,
          paddingHorizontal: 20,
          borderRadius: 10,
          margin: 20,
        }}
      >
        <Text
          style={{
            color: colors.linkText,
            fontWeight: "800",
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          Product on sale
        </Text>

        <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
          Do you have a product/ products you're selling? You can list them
          here. The first two products are free. Any subsequent products will be
          paid for at KSH. 300 per product. All products expire after 90 days
          and you'll be required to update
        </Text>

        <PrimaryButton
          onPress={() => navigation.navigate("PostProduct")}
          buttonTitle="Post product"
        />
      </LinearGradient>

      <LinearGradient
        colors={[colors.almostDark, colors.dark]}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 40,
          borderRadius: 10,
          margin: 20,
        }}
      >
        <Text
          style={{
            color: colors.linkText,
            fontWeight: "800",
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          Product request
        </Text>

        <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
          Are you a buyer looking for a particular product ? You can list your
          product request and the buyers will reach out to you
        </Text>

        <TertiaryButton
          onPress={() => navigation.navigate("PostProductRequest")}
          buttonTitle="Post product"
        />
      </LinearGradient>
    </ScrollView>
  );
}

const postOptionsStyles = StyleSheet.create({});

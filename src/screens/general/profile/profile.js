import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import styles from "../../../componets/styles/global-styles";
import { LinearGradient } from "expo-linear-gradient";

import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";

export default function Profile({ route, navigation }) {
  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  const email = route.params.email;
  const phoneNumber = route.params.phoneNumber;

  return (
    <ScrollView style={[styles.container, { padding: 20 }]}>
      <Image
        source={require("../../../assets/images/tabs.jpg")}
        style={profileStyles.image}
      />

      <LinearGradient
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        locations={[0.0, 1.0]}
        style={profileStyles.detailsContainer}
        colors={["#070b2c", colors.dark]}
      >
        <View style={profileStyles.hor}>
          <View>
            <View style={profileStyles.iconAndLabel}>
              <FontAwesome name="user" size={18} color={colors.gray} />
              <Text style={profileStyles.label}>First name</Text>
            </View>

            <View style={profileStyles.iconAndLabel}>
              <FontAwesome name="user-circle" size={14} color={colors.gray} />
              <Text style={profileStyles.label}>Last name</Text>
            </View>

            <View style={profileStyles.iconAndLabel}>
              <FontAwesome name="phone-square" size={17} color={colors.gray} />
              <Text style={profileStyles.label}>Phone</Text>
            </View>

            <View style={profileStyles.iconAndLabel}>
              <Ionicons name="mail" size={16} color={colors.gray} />
              <Text style={profileStyles.label}>Email</Text>
            </View>
          </View>

          <View>
            <Text style={profileStyles.labDetails}>{firstName}</Text>
            <Text style={profileStyles.labDetails}>{lastName}</Text>
            <Text style={profileStyles.labDetails}>{email}</Text>
            <Text style={profileStyles.labDetails}>{phoneNumber}</Text>
          </View>
        </View>

        <PrimaryButton
          buttonTitle="Edit profile"
          onPress={() =>
            navigation.navigate("EditProfile", {
              firstName,
              lastName,
              email,
              phoneNumber,
            })
          }
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
    position: "absolute",
    zIndex: 1,
  },
  detailsContainer: {
    width: "100%",
    borderRadius: 10,
    height: 400,
    padding: 20,
    paddingTop: 80,
    top: 150,
    marginBottom: 200,
  },
  iconAndLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  hor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 40,
  },
  label: {
    fontWeight: "800",
    color: colors.gray,
    marginLeft: 10,
  },
  labDetails: {
    fontWeight: "800",
    color: colors.lightBlue,
    textAlign: "right",
  },
});

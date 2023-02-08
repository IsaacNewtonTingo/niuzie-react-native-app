import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";

import * as Linking from "expo-linking";

import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import colors from "../colors/colors";

import dateFormat from "dateformat";
import styles from "../styles/global-styles";
import { Avatar } from "react-native-paper";

export default function FullProductRequest(props) {
  const userName = props.data.buyerName;
  const profilePicture = props.data.buyerProfilePicture;
  let phoneNumber = props.data.buyerPhoneNumber;
  const email = props.data.buyerEmail;
  const location = props.data.location;
  const date = props.data.date;
  const premium = props.data.premium;

  const content = props.data.content;

  phoneNumber = phoneNumber.toString();

  async function sendSMS() {
    await Linking.openURL(`sms:+${phoneNumber}`);
  }

  return (
    <LinearGradient
      start={[0.0, 0.5]}
      end={[1.0, 0.5]}
      locations={[0.0, 1.0]}
      colors={["#78869F", "#001949"]}
      style={fullStyles.background}
    >
      <View style={styles.spaceBetween}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {profilePicture ? (
            <Avatar.Image source={{ uri: profilePicture }} size={40} />
          ) : (
            <FontAwesome name="user-circle-o" size={40} color="#A8B8D8" />
          )}

          <View>
            <Text
              style={{
                marginLeft: 10,
                fontWeight: "800",
                color: colors.lightBlue,
                fontSize: 16,
              }}
            >
              {userName}
            </Text>

            <Text
              style={{
                marginLeft: 10,
                fontWeight: "800",
                color: colors.gray,
                fontSize: 16,
              }}
            >
              {premium
                ? phoneNumber
                : phoneNumber.slice(0, 6) + "XXXXX" + phoneNumber.slice(-1)}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            disabled={!premium}
            onPress={() => {
              Linking.openURL(`tel:+${phoneNumber}`);
            }}
          >
            <Feather name="phone-call" size={20} color={colors.linkText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 20 }}
            disabled={!premium}
            onPress={sendSMS}
          >
            <FontAwesome5 name="sms" size={20} color={colors.lightBlue} />
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={{
          marginVertical: 20,
          fontWeight: "600",
          color: "white",
          fontSize: 14,
        }}
      >
        {content.length <= 60 ? content : content.slice(0, 59) + "..."}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location" size={12} color={colors.linkText} />

          <Text
            style={{
              color: colors.linkText,
              fontWeight: "800",
              fontSize: 10,
            }}
          >
            {location}
          </Text>
        </View>

        <Text style={{ fontWeight: "800", color: colors.gray, fontSize: 10 }}>
          {dateFormat(date, "mediumDate")}
        </Text>
      </View>
    </LinearGradient>
  );
}

const fullStyles = StyleSheet.create({
  background: {
    minHeight: 140,
    width: "100%",
    marginRight: 10,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "space-between",
  },
});

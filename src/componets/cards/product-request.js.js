import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import colors from "../colors/colors";

import dateFormat from "dateformat";
import { Avatar } from "react-native-paper";

export default function ProductRequest(props) {
  const userName = props.item.user.firstName + " " + props.item.user.lastName;
  const profilePicture = props.item.user.profilePicture;
  const phoneNumber = props.item.user.phoneNumber;
  const email = props.item.user.email;
  const content = props.item.content;
  const location = props.item.user.county + ", " + props.item.user.subCounty;
  const date = props.item.createdAt;
  const onPress = props.onPress;
  const style = props.style;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          height: 140,
          width: width / 1.5,
          marginRight: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderLeftWidth: 1,
          borderLeftColor: colors.orange,
        },
        style,
      ]}
    >
      <LinearGradient
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        locations={[0.0, 1.0]}
        colors={["#78869F", "#001949"]}
        style={[gradientStyles.background, props.styles]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {profilePicture ? (
            <Avatar.Image source={{ uri: profilePicture }} size={18} />
          ) : (
            <FontAwesome name="user-circle-o" size={18} color="#A8B8D8" />
          )}
          <Text
            style={{
              marginLeft: 10,
              fontWeight: "800",
              color: "#A8B8D8",
              fontSize: 10,
            }}
          >
            {userName}
          </Text>
        </View>

        <Text
          style={{
            marginVertical: 10,
            fontWeight: "600",
            color: "white",
            fontSize: 12,
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

          <Text
            style={{
              fontWeight: "800",
              textAlign: "right",
              color: "#A8B8D8",
              fontSize: 10,
            }}
          >
            {dateFormat(date, "mediumDate")}
            {"\n"}
            {dateFormat(date, "shortTime")}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const gradientStyles = StyleSheet.create({
  background: {
    height: "100%",
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    borderLeftWidth: 2,
    borderLeftColor: colors.orange,
  },
});

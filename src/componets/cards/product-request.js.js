import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import colors from "../colors/colors";

export default function ProductRequest(props) {
  const userName = props.item.firstName + " " + props.item.lastName;
  const profilePicture = props.item.profilePicture;
  const content = props.item.content;
  const location = props.item.county + ", " + props.item.subCounty;
  const date = props.item.date;

  return (
    <TouchableOpacity>
      <LinearGradient
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        locations={[0.0, 1.0]}
        colors={["#78869F", "#001949"]}
        style={gradientStyles.background}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} />
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

          <Text style={{ fontWeight: "800", color: "#A8B8D8", fontSize: 10 }}>
            {date}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const gradientStyles = StyleSheet.create({
  background: {
    height: 140,
    width: width / 1.5,
    marginRight: 10,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "space-between",
  },
});

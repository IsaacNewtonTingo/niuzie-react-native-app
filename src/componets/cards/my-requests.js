import { StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import dateFormat from "dateformat";

const { width } = Dimensions.get("window");

export default function MyRequests(props) {
  const content = props.item.content;
  const date = props.item.createdAt;
  return (
    <TouchableOpacity
      style={{ alignSelf: "center", width: width - 20, alignItems: "center" }}
      onPress={props.onPress}
    >
      <LinearGradient
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        locations={[0.0, 1.0]}
        colors={["#78869F", "#001949"]}
        style={[myReqStyles.background, props.styles]}
      >
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

        <Text style={{ fontWeight: "800", color: "#A8B8D8", fontSize: 10 }}>
          {dateFormat(date, "mediumDate")} ~ {dateFormat(date, "shortTime")}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const myReqStyles = StyleSheet.create({
  background: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 10,
    alignSelf: "center",
  },
});

import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useContext } from "react";
import colors from "../colors/colors";

import { verticalProductCardStyles } from "./vertical-product";

import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import styles from "../styles/global-styles";
import noImage from "../../assets/data/noImage";
import { TouchableOpacity } from "react-native-gesture-handler";

import { CredentialsContext } from "../../componets/context/credentials-context";

const { width } = Dimensions.get("window");

export default function ReviewComponent(props) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";

  const firstName = props.firstName;
  const lastName = props.lastName;
  const profilePicture = props.profilePicture;
  const date = props.date;
  const rating = props.rating;
  const reviewMessage = props.reviewMessage;
  const key = props.myKey;

  const productOwnerID = props.productOwnerID;

  return (
    <View
      key={key}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
        marginBottom: 20,
      }}
    >
      <View style={styles.spaceBetween}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: 20, height: 20, borderRadius: 10, marginRight: 10 }}
            source={{
              uri: profilePicture ? profilePicture : noImage.noProfilePic,
            }}
          />

          <Text style={{ color: colors.abitGray, fontWeight: "800" }}>
            {firstName} {lastName} ~
          </Text>
          <Text style={{ color: colors.gray }}>{date}</Text>
        </View>

        <View style={verticalProductCardStyles.ratingContainer}>
          <AntDesign name="star" size={14} color={colors.orange} />
          <Text style={verticalProductCardStyles.ratingText}>{rating}</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          maxWidth: width,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: colors.lightBlue,
            marginTop: 10,
            width: width - 40,
          }}
        >
          {reviewMessage}
        </Text>

        {userID == productOwnerID && (
          <TouchableOpacity>
            <Entypo name="trash" size={18} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

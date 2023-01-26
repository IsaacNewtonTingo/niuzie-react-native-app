import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import styles from "../../../componets/styles/global-styles";
import ProductRequest from "../../../componets/cards/product-request.js";
import StaticAlert from "../../../componets/alerts/static-alert";
import FullProductRequest from "../../../componets/cards/full-product-request";
import PrimaryButton from "../../../componets/buttons/primary-button";
import { postStyles } from "../../seller/post-product";

export default function ProductRequestDetails({ route, navigation }) {
  const buyerName =
    route.params.item.user.firstName + " " + route.params.item.user.lastName;
  const buyerEmail = route.params.item.user.email;
  const buyerPhoneNumber = route.params.item.user.phoneNumber;
  const buyerProfilePicture = route.params.item.user.profilePicture;
  const location =
    route.params.item.user.county + ", " + route.params.item.user.subCounty;
  const date = route.params.item.createdAt;
  const content = route.params.item.content;

  const data = {
    buyerName,
    buyerEmail,
    buyerPhoneNumber,
    buyerProfilePicture,
    location,
    date,
    content,
  };

  return (
    <ScrollView style={styles.container}>
      <StaticAlert
        status="warning"
        title="Warning"
        description="In order to get access to the buyers' contact details, you need to be a premium member."
      />

      <View style={postStyles.holdingContainer}>
        <FullProductRequest data={data} />

        <PrimaryButton buttonTitle="Join premium" />
      </View>
    </ScrollView>
  );
}

const requestStyles = StyleSheet.create({});

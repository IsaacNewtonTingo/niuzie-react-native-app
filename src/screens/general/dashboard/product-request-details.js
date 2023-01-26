import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import styles from "../../../componets/styles/global-styles";
import ProductRequest from "../../../componets/cards/product-request.js";

export default function ProductRequestDetails({ route, navigation }) {
  const buyerName =
    route.params.item.user.firstName + route.params.item.user.lastName;
  const buyerEmail = route.params.item.user.email;
  const buyerPhoneNumber = route.params.item.user.phoneNumber;
  const buyerProfilePicture = route.params.item.user.profilePicture;
  const location =
    route.params.item.user.county + route.params.item.user.subCounty;

  return <ScrollView style={styles.container}></ScrollView>;
}

const requestStyles = StyleSheet.create({});

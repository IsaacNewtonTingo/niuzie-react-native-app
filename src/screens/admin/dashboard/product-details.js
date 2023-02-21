import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import styles from "../../../componets/styles/global-styles";
import Carousel from "react-native-reanimated-carousel";

import noImage from "../../../assets/data/noImage";
import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";

const width = Dimensions.get("window").width;

export default function AdminProductDetails({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const token = storedCredentials ? data.token : "";
  const userID = storedCredentials ? data.userID : "";

  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerifies] = useState(false);

  const productImages = [
    route.params.item.image1
      ? route.params.item.image1
      : noImage.noProductImage,
    route.params.item.image2
      ? route.params.item.image2
      : noImage.noProductImage,
    route.params.item.image3
      ? route.params.item.image1
      : noImage.noProductImage,
    route.params.item.image4
      ? route.params.item.image4
      : noImage.noProductImage,
  ];

  const headers = {
    "auth-token": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  async function approve() {
    const url = `${process.env.ENDPOINT}/admin/approve-product/${route.params.item._id}?userID=${userID}`;

    setSubmitting(true);
    await axios
      .put(url, {}, { headers })
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });

          navigation.goBack();
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  async function reject() {
    const url = `${process.env.ENDPOINT}/admin/approve-product/${route.params.item._id}?userID=${userID}`;

    setSubmitting(true);
    await axios
      .put(url, {}, { headers })
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });

          navigation.goBack();
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      <Carousel
        loop
        width={width}
        height={width / 1.2}
        autoPlay={true}
        data={productImages}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 300,
        }}
        renderItem={({ item }) => (
          <View
            key={item}
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: "100%", width: "100%" }}
              source={{ uri: item }}
            />
          </View>
        )}
      />

      <View style={styles.section}>
        <Text style={[styles.subText, { marginBottom: 20 }]}>
          Product details
        </Text>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Product name:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.productName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Description:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.description}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Category:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.category.categoryName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Sub category:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.subCategory.subCategoryName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Price:</Text>
          <Text style={prodDetailsStyles.desc}>
            KSH. {route.params.item.price}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.subText, { marginBottom: 20 }]}>User details</Text>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>First name:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.firstName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Last name:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.lastName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Phone number:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.phoneNumber}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>County:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.county}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Sub county:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.subCounty}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <PrimaryButton
          onPress={approve}
          submitting={submitting}
          disabled={submitting}
          buttonTitle="Approve"
        />

        <TertiaryButton
          onPress={reject}
          submitting={submitting}
          disabled={submitting}
          buttonTitle="Reject"
        />
      </View>
    </ScrollView>
  );
}

const prodDetailsStyles = StyleSheet.create({
  textsCont: {
    flexDirection: "column",
    marginBottom: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.gray,
    paddingBottom: 20,
  },
  sub: {
    color: colors.gray,
    fontWeight: "800",
    marginRight: 10,
    marginBottom: 10,
  },
  desc: {
    color: colors.lightBlue,
    fontWeight: "800",
  },
});

import { StyleSheet, ScrollView, Text, View, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";

import styles from "../../../componets/styles/global-styles";
import StaticAlert from "../../../componets/alerts/static-alert";
import FullProductRequest from "../../../componets/cards/full-product-request";
import PrimaryButton from "../../../componets/buttons/primary-button";

import { postStyles } from "../../seller/post-product";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import LoginComponent from "../../../componets/auth/login";
import { Modal } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../../componets/colors/colors";
import { showMyToast } from "../../../functions/show-toast";
import axios from "axios";

export default function ProductRequestDetails({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [premium, setPremium] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkStoreCredentials();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function checkStoreCredentials() {
    const { data } = storedCredentials ? storedCredentials : "";
    if (data) {
      getUserData(data.userID, data.token);

      setUserID(data.userID);
      setToken(data.token);
    } else {
      setUserID("");
      setToken("");
      setLoadingData(false);
    }
  }

  async function getUserData(userID, token) {
    setLoadingData(true);
    const url = `${process.env.ENDPOINT}/user/get-user-data/${userID}`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers: headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setPremium(response.data.data.premium);
        } else {
          setPremium(false);
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

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
    premium,
  };

  async function login() {
    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "First name is required. Please add a name then proceed",
      });
    } else if (!password) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Password is required. Please add a password then proceed",
      });
    } else {
      setSubmitting(true);
      const url = `${process.env.ENDPOINT}/user/login`;
      await axios
        .post(url, {
          phoneNumber: parseInt(phoneNumber),
          password,
        })
        .then((response) => {
          setSubmitting(false);
          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });

            const { data } = response.data;
            storeCredentials({ data });
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
  }

  async function storeCredentials(values) {
    await SecureStore.setItemAsync("loginCredentials", JSON.stringify(values))
      .then(() => {
        setPassword("");
        setStoredCredentials(values);
        setPremium(values.data.premium);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={styles.container}>
      {!storedCredentials && (
        <Modal backgroundColor={colors.almostDark} width="100%" isOpen={true}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              alignItems: "flex-end",
              right: 20,
              marginBottom: 20,
              width: Dimensions.get("window").width,
            }}
          >
            <Text style={{ color: colors.orange, fontWeight: "800" }}>
              Close
            </Text>
          </TouchableOpacity>

          <LoginComponent
            submitting={submitting}
            loginPress={login}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            password={password}
            setPassword={setPassword}
          />
        </Modal>
      )}

      {!premium && (
        <StaticAlert
          status="warning"
          title="Warning"
          description="In order to get access to the buyers' contact details, you need to be a premium member."
        />
      )}

      <View style={postStyles.holdingContainer}>
        <FullProductRequest data={data} />

        {!premium && <PrimaryButton buttonTitle="Join premium" />}
      </View>
    </ScrollView>
  );
}

const requestStyles = StyleSheet.create({});

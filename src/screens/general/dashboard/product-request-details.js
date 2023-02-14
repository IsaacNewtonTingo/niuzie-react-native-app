import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";

import styles from "../../../componets/styles/global-styles";
import StaticAlert from "../../../componets/alerts/static-alert";
import FullProductRequest from "../../../componets/cards/full-product-request";
import PrimaryButton from "../../../componets/buttons/primary-button";

import { postStyles } from "../../seller/post-product";
import { Ionicons } from "@expo/vector-icons";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import { Modal } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { showMyToast } from "../../../functions/show-toast";

import axios from "axios";
import colors from "../../../componets/colors/colors";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ProductRequestDetails({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    checkStoreCredentials();
  }, [(navigation, loading)]);

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
  const needID = route.params.item._id;
  const needUserID = route.params.item.user._id;
  const [content, setContent] = useState(route.params.item.content);

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

  const headers = {
    "auth-token": token,
  };

  async function updateRequest() {
    const url = `${process.env.ENDPOINT}/buyer-needs/edit-need/${needID}`;
    setSubmitting(true);

    await axios
      .put(url, { userID, content }, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        } else {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          navigation.goBack();
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  async function deleteRequest() {
    const url = `${process.env.ENDPOINT}/buyer-needs/delete-need/${needID}?userID=${userID}`;
    setSubmitting(true);

    await axios
      .delete(url, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        } else {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          navigation.goBack();
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
    >
      {!premium && (
        <StaticAlert
          status="warning"
          title="Warning"
          description="In order to get access to the buyers' contact details, you need to be a premium member."
        />
      )}

      <View style={postStyles.holdingContainer}>
        <FullProductRequest data={data} />

        {userID == needUserID && (
          <>
            <Text style={[styles.label, { marginTop: 40 }]}>
              Edit products request
            </Text>

            <View style={styles.textInputContainer}>
              <Ionicons
                name="shirt"
                size={18}
                color={colors.gray}
                style={styles.searchIcon}
              />
              <TextInput
                value={content}
                onChangeText={setContent}
                style={[
                  styles.textInput,
                  { color: colors.dark, width: "100%" },
                ]}
                placeholder="e.g Sneakers"
              />
            </View>

            <PrimaryButton
              buttonTitle="Update"
              disabled={submitting}
              submitting={submitting}
              onPress={updateRequest}
            />

            <TertiaryButton
              buttonTitle="Delete"
              disabled={submitting}
              submitting={submitting}
              onPress={deleteRequest}
            />
          </>
        )}

        {!premium && <PrimaryButton buttonTitle="Join premium" />}
      </View>
    </KeyboardAwareScrollView>
  );
}

const requestStyles = StyleSheet.create({});

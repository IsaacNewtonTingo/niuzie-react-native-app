import { ScrollView, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useContext, useState } from "react";

import colors from "../../componets/colors/colors";
import styles from "../../componets/styles/global-styles";
import PrimaryButton from "../../componets/buttons/primary-button";
import axios from "axios";

import { postStyles } from "../seller/post-product";
import { showMyToast } from "../../functions/show-toast";

import {
  CredentialsContext,
  AuthContext,
} from "../../componets/context/credentials-context";

export default function PostProductRequest() {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { auth, setAuth } = useContext(AuthContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";
  const token = storedCredentials ? data.token : "";

  function validate() {
    if (!content) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Please write what you're looking for then submit",
      });
    } else {
      postProductRequest();
    }
  }

  const headers = {
    "auth-token": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  async function postProductRequest() {
    if (!userID) {
      showMyToast({
        status: "info",
        title: "Requirement",
        description:
          "You need to login to perform this operation. Signup if you don't have an account",
      });
      setAuth(true);
    } else {
      const url = `${process.env.ENDPOINT}/buyer-needs/post-need`;
      setSubmitting(true);

      await axios
        .post(
          url,
          {
            content,
            userID,
          },
          { headers: headers }
        )
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);

          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });
            setContent("");
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
  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      <View style={postStyles.holdingContainer}>
        <Text style={styles.subText}>What are you looking for?</Text>
        <Text style={requestStyles.descText}>
          Is there a specific product you are looking for? You can specify it
          down below and sellers who have the product will be able to contact
          you. Please note that your contact details will be shared to the
          sellers and any transactions with them will be at your own risk as
          stated in the terms and conditions.
        </Text>

        <Text
          style={[styles.label, { marginBottom: 10, color: colors.linkText }]}
        >
          Describe what you're looking for
        </Text>
        <TextInput
          style={styles.textInput}
          value={content}
          placeholder="e.g I'm looking for an iPhone 14 pro max..."
          onChangeText={setContent}
        />

        <PrimaryButton
          submitting={submitting}
          disabled={submitting}
          buttonTitle="Submit"
          onPress={validate}
        />
      </View>
    </ScrollView>
  );
}

const requestStyles = StyleSheet.create({
  descText: {
    color: colors.lightBlue,
    marginVertical: 20,
  },
});

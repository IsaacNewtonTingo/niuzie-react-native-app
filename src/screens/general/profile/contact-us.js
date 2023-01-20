import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import styles from "../../../componets/styles/global-styles";

import { postStyles } from "../../seller/post-product";
import { TextInput } from "react-native-paper";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";
import { Alert } from "react-native";

export default function ContactUs({ route }) {
  const user = route.params.userID;
  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  const email = route.params.email;
  const phoneNumber = route.params.phoneNumber;

  const fullName = firstName + " " + lastName;
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function sendMessage() {
    setSubmitting(true);
    await axios
      .post(`${process.env.ENDPOINT}/user/contact-us`, {
        user,
        fullName,
        phoneNumber,
        email,
        message,
      })
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);
        if (response.data.status == "Success") {
          Alert.alert(response.data.message);
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err.message);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={postStyles.holdingContainer}>
        <Text style={styles.label}>Message</Text>
        <View style={styles.textInputContainer}>
          <Entypo
            name="new-message"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g blah blah blah"
          />
        </View>

        <PrimaryButton
          buttonTitle="Send"
          disabled={submitting}
          submitting={submitting}
          onPress={sendMessage}
        />
      </View>
    </ScrollView>
  );
}

const contactStyles = StyleSheet.create({});

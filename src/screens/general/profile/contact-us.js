import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import styles from "../../../componets/styles/global-styles";

import { postStyles } from "../../seller/post-product";
import { TextInput } from "react-native-paper";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";

import { showMyToast } from "../../../functions/show-toast";

import { CredentialsContext } from "../../../componets/context/credentials-context";

import { Divider, Flex } from "native-base";
import { LinearGradient } from "expo-linear-gradient";

export default function ContactUs({ route }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;

  const user = userID;
  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  const phoneNumber = route.params.phoneNumber;

  const fullName = firstName + " " + lastName;
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function sendMessage() {
    if (!message) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Message field is required. Please write something then submit",
      });
    } else {
      setSubmitting(true);
      await axios
        .post(
          `${process.env.ENDPOINT}/user/contact-us`,
          {
            user,
            fullName,
            phoneNumber,
            message,
          },
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          setSubmitting(false);
          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });
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
          console.log(err.message);
        });
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      <LinearGradient
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        colors={[colors.dark, colors.cardColor, colors.dark]}
        style={contactStyles.gradient}
      >
        <Flex direction="row" h="58" p="4">
          <View style={contactStyles.rowItems}>
            <Feather name="phone-call" size={18} color={colors.gray} />
            <Text style={contactStyles.leaText}>+254725667687</Text>
          </View>

          <Divider bg="amber.500" thickness="2" mx="2" orientation="vertical" />

          <View style={contactStyles.rowItems}>
            <Feather name="mail" size={18} color={colors.gray} />
            <Text style={contactStyles.leaText}>info@niuzie.com</Text>
          </View>
        </Flex>
      </LinearGradient>

      <View style={postStyles.holdingContainer}>
        <Text style={styles.label}>First name</Text>
        <View style={styles.textInputContainer}>
          <FontAwesome5
            name="user-tie"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={firstName}
            editable={false}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g blah blah blah"
          />
        </View>

        <Text style={styles.label}>Last name</Text>
        <View style={styles.textInputContainer}>
          <FontAwesome5
            name="user-alt"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={lastName}
            editable={false}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g blah blah blah"
          />
        </View>

        <Text style={styles.label}>Phone number</Text>
        <View style={styles.textInputContainer}>
          <Entypo
            name="old-phone"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={phoneNumber.toString()}
            editable={false}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g blah blah blah"
          />
        </View>

        <Text style={styles.label}>Message</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            value={message}
            multiline={true}
            onChangeText={setMessage}
            style={[styles.textInput, { color: colors.dark, height: 100 }]}
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

const contactStyles = StyleSheet.create({
  leaText: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginLeft: 10,
  },
  rowItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradient: {
    alignItems: "center",
    marginTop: 20,
  },
});

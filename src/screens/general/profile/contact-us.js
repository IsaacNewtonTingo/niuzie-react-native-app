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

export default function ContactUs() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function sendMessage() {
    setSubmitting(true);
    await axios
      .post(`https://niuzie.herokuapp.com/api/user/contact-us`, {
        fullName,
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
        <Text style={styles.label}>Full name</Text>
        <View style={styles.textInputContainer}>
          <FontAwesome5
            name="user-tie"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g John"
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.textInputContainer}>
          <Entypo
            name="mail"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g johndoe@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

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

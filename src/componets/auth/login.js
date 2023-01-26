import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import styles from "../styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";

import { CredentialsContext } from "../context/credentials-context";
import { showMyToast } from "../../functions/show-toast";

export default function LoginComponent(props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const onSignupPress = props.onSignupPress;

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";

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
          console.log(response.data);
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
        setStoredCredentials(values);
        props.getStoredCredentialsAfterLogin();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <View style={loginStyles.holdingContainer}>
      <Text style={styles.label}>Phone number</Text>
      <View style={styles.textInputContainer}>
        <Entypo
          name="old-phone"
          size={18}
          color="black"
          style={styles.searchIcon}
        />
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={[styles.textInput, { color: colors.dark }]}
          placeholder="e.g +254724753175"
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.textInputContainer}>
        <FontAwesome5
          name="lock"
          size={18}
          color="black"
          style={styles.searchIcon}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={[styles.textInput, { color: colors.dark }]}
          placeholder="*******"
          secureTextEntry={true}
        />
      </View>

      <PrimaryButton
        submitting={submitting}
        disabled={submitting}
        onPress={login}
        buttonTitle="Login"
      />

      <View style={styles.optTextSign}>
        <Text style={styles.firstText}>Don't have an account ?</Text>
        <TouchableOpacity onPress={onSignupPress}>
          <Text style={styles.opt2Text}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const loginStyles = StyleSheet.create({
  holdingContainer: {
    backgroundColor: colors.cardColor,
    padding: 40,
    borderRadius: 10,
    width: "90%",
  },
});

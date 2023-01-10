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
import { postStyles } from "../../screens/seller/post-product";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";
import TopAlert from "../alerts/top-alert";

import { CredentialsContext } from "../context/credentials-context";

export default function LoginComponent({ navigation, route }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";

  async function login() {
    if (!phoneNumber) {
      setAlertMessage("Phone number is required");
      setAlertStatus("error");
      setAlert(true);
    } else if (!password) {
      setAlertMessage("Password is required");
      setAlertStatus("error");
      setAlert(true);
    } else {
      setSubmitting(true);
      const url = `${process.env.ENDPOINT}/user/login`;
      console.log(url);
      await axios
        .post(url, {
          phoneNumber: parseInt(phoneNumber),
          password,
        })
        .then((response) => {
          setSubmitting(false);
          console.log(response.data);
          if (response.data.status == "Success") {
            setAlertMessage(response.data.message);
            setAlertStatus("success");
            setAlert(true);

            const { data } = response.data;

            storeCredentials({ data });
          } else {
            setAlertMessage(response.data.message);
            setAlertStatus("error");
            setAlert(true);
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
        console.log(values);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={styles.container}>
      {alert && (
        <TopAlert
          onPress={() => setAlert(false)}
          alertMessage={alertMessage}
          alertStatus={alertStatus}
        />
      )}
      <View style={postStyles.holdingContainer}>
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
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.opt2Text}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

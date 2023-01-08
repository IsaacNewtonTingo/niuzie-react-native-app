import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import styles from "../../../componets/styles/global-styles";
import { postStyles } from "../../seller/post-product";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import TopAlert from "../../../componets/alerts/top-alert";
import { useEffect } from "react";
import axios from "axios";

export default function Login({ navigation, route }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

  useEffect(() => {
    if (route.params.alertMessage) {
      setAlert(true);
      setAlertMessage(route.params.alertMessage);
      setAlertStatus(route.params.alertStatus);
    }
  }, []);

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

        <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Forgot password ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.opt2Text}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

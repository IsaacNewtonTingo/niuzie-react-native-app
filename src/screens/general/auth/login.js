import { TouchableOpacity, TextInput, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import styles from "../../../componets/styles/global-styles";
import { postStyles } from "../../seller/post-product";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";

import {
  CredentialsContext,
  AuthContext,
} from "../../../componets/context/credentials-context";
import { showMyToast } from "../../../functions/show-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

export default function Login({ navigation, route }, props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { auth, setAuth } = useContext(AuthContext);

  async function login() {
    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Phone number is required",
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
        setStoredCredentials(values);
        setAuth(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
    >
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

        <TertiaryButton
          submitting={submitting}
          disabled={submitting}
          onPress={() => navigation.navigate("SignUp")}
          buttonTitle="Signup"
        />

        <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Forgot password ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <Text style={styles.opt2Text}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Don't have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.opt2Text}>Signup</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </KeyboardAwareScrollView>
  );
}

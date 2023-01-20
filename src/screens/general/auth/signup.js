import {
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import styles from "../../../componets/styles/global-styles";
import { postStyles } from "../../seller/post-product";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";

import { BottomSheet } from "react-native-btr";
import CenteredAlert from "../../../componets/alerts/centered-alert";

import { ENDPOINT } from "@env";

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [visible, setVisible] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [otp, setOtp] = useState("");

  async function signUp() {
    //validate
    if (!firstName) {
      setAlert(true);
      setAlertMessage("First name is required");
    } else if (!lastName) {
      setAlert(true);
      setAlertMessage("Last name is required");
    } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      setAlert(true);
      setAlertMessage("Invalid name format");
    } else if (!email) {
      setAlert(true);
      setAlertMessage("Email is required");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setAlert(true);
      setAlertMessage("Invalid email address");
    } else if (!phoneNumber) {
      setAlert(true);
      setAlertMessage("Phone number is required");
    } else if (!phoneNumber.startsWith(254)) {
      setAlert(true);
      setAlertMessage("Invalid phone number");
    } else if (!password) {
      setAlert(true);
      setAlertMessage("Password is required");
    } else if (password.length < 8) {
      setAlert(true);
      setAlertMessage("Password is too short. Use at least 8 characters");
    } else if (password != confirmPassword) {
      setAlert(true);
      setAlertMessage("Passwords don't match");
    } else {
      const url = `${process.env.ENDPOINT}/user/signup`;
      console.log(url);
      setSubmitting(true);

      await axios
        .post(url, {
          email,
          phoneNumber,
        })
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);

          if (response.data.status == "Success") {
            setVisible(true);
          } else {
            setAlert(true);
            setAlertMessage(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
        });
    }
  }

  async function verifyCode() {
    setSubmitting(true);
    const url = `${process.env.ENDPOINT}/user/verify-code`;

    await axios
      .post(url, {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        verificationCode: otp,
      })
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);
        if (response.data.status == "Success") {
          navigation.navigate("Login", {
            alertMessage: "Code verified successfuly. Please login",
            alertStatus: "success",
          });
          setVisible(false);
        } else {
          setAlert(true);
          setAlertMessage(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  }

  return (
    <ScrollView style={styles.container}>
      {alert && (
        <CenteredAlert
          onPress={() => setAlert(false)}
          alertMessage={alertMessage}
          alertStatus="error"
        />
      )}
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
            onChangeText={setFirstName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g John"
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
            onChangeText={setLastName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g Doe"
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
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g +254724753175"
            keyboardType="phone-pad"
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

        <Text style={styles.label}>Confirm password</Text>
        <View style={styles.textInputContainer}>
          <FontAwesome5
            name="lock"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="********"
            secureTextEntry={true}
          />
        </View>

        <PrimaryButton
          disabled={submitting}
          onPress={signUp}
          buttonTitle="Signup"
          submitting={submitting}
        />

        <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Already have an account ?</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Login", {
                alertMessage: "",
                alertStatus: "",
              })
            }
          >
            <Text style={styles.opt2Text}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        visible={visible}
        onBackButtonPress={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={signStyles.bottomNavigationView}>
          <Text
            style={[styles.label, { textAlign: "center", marginVertical: 20 }]}
          >
            Enter verification code sent to your phone number to finish setting
            up your account
          </Text>
          <View style={styles.textInputContainer}>
            <FontAwesome
              name="qrcode"
              size={18}
              color="black"
              style={styles.searchIcon}
            />
            <TextInput
              value={otp}
              onChangeText={setOtp}
              style={[styles.textInput, { color: colors.dark, width: "100%" }]}
              placeholder="e.g 2763"
              keyboardType="numeric"
            />
          </View>

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={verifyCode}
            buttonTitle="Submit"
          />

          <View style={styles.optTextSign}>
            <Text style={styles.firstText}>Didn't recieve code ?</Text>
            <TouchableOpacity>
              <Text style={styles.opt2Text}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

const signStyles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: colors.cardColor,
    width: "100%",
    height: 300,
    padding: 20,
  },
});

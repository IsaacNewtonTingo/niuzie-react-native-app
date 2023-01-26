import {
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import styles from "../styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";
import axios from "axios";

import { BottomSheet } from "react-native-btr";
import { showMyToast } from "../../functions/show-toast";

export default function SignUpComponent(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [visible, setVisible] = useState(false);

  const [otp, setOtp] = useState("");

  async function signUp() {
    //validate
    if (!firstName) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "First name is required. Please add a name then proceed",
      });
    } else if (!lastName) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Last name is required. Please add a name then proceed",
      });
    } else if (!/^[a-zA-Z ]*$/.test(firstName, lastName)) {
      showMyToast({
        status: "error",
        title: "Inavlid format",
        description: "Name shoult only contain characters",
      });
    } else if (!email) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Email is required. Please add an email then proceed",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      showMyToast({
        status: "error",
        title: "Invalid format",
        description: "Email provided is invalid. Please check and change",
      });
    } else if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Phone number is required. Please add a phone number then proceed",
      });
    } else if (!phoneNumber.startsWith(254)) {
      showMyToast({
        status: "error",
        title: "Invalid format",
        description: "Phone number must start with 254. No +",
      });
    } else if (!password) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Password is required. Please add a password then proceed",
      });
    } else if (password.length < 8) {
      showMyToast({
        status: "error",
        title: "Invalid field",
        description: "Password should be at least 8 characters long",
      });
    } else if (password != confirmPassword) {
      showMyToast({
        status: "error",
        title: "Non matching fields",
        description: "Passwords don't match",
      });
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
    <>
      <View style={signStyles.holdingContainer}>
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
          <TouchableOpacity onPress={props.onLoginPress}>
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
    </>
  );
}

const signStyles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: colors.cardColor,
    width: "100%",
    height: 300,
    padding: 20,
  },
  holdingContainer: {
    backgroundColor: colors.cardColor,
    padding: 40,
    borderRadius: 10,
    width: "90%",
  },
});

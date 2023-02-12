import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";

import styles from "../../../componets/styles/global-styles";
import PrimaryButton from "../../../componets/buttons/primary-button";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";
import { postStyles } from "../../seller/post-product";
import colors from "../../../componets/colors/colors";

export default function NewPassword({ route, navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function changePassword() {
    const url = `${process.env.ENDPOINT}/user/change-password`;
    setSubmitting(true);

    if (!otp) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Please enter an otp",
      });
    } else if (!password) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Please enter a new password",
      });
    } else if (password.length < 8) {
      showMyToast({
        status: "error",
        title: "Failed",
        description: "Password is too short",
      });
    } else if (password !== confirmPassword) {
      showMyToast({
        status: "error",
        title: "Password mismatch",
        description: "Passwords don't match",
      });
    } else {
      await axios
        .post(url, { phoneNumber: route.params.phoneNumber, otp, password })
        .then((response) => {
          setSubmitting(false);
          console.log(response.data);

          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message + ". Please login",
            });
            navigation.navigate("Login");
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
            setPhoneNumber("");
            setPassword("");
            setOtp("");
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
          setPhoneNumber("");
          setPassword("");
          setOtp("");
        });
    }
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
    >
      <View style={postStyles.holdingContainer}>
        <Text style={[styles.label, { color: colors.gray, marginBottom: 20 }]}>
          Please enter the otp sent to your phone to complete the password reset
          process. The otp expires in 5 minutes.
        </Text>

        <Text style={styles.label}>OTP</Text>
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
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g 2763"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>New password</Text>
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
        <Text style={styles.label}>Confirm new password</Text>
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
          submitting={submitting}
          disabled={submitting}
          onPress={changePassword}
          buttonTitle="Submit"
        />

        <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Didn't receive code ?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.opt2Text}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const resetStyles = StyleSheet.create({});

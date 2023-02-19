import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import styles from "../../../componets/styles/global-styles";
import { postStyles } from "../../seller/post-product";

import PrimaryButton from "../../../componets/buttons/primary-button";

import { FontAwesome } from "@expo/vector-icons";
import colors from "../../../componets/colors/colors";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";

export default function ConfirmOtp({ route, navigation }) {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function verifyCode() {
    setSubmitting(true);
    const url = `${process.env.ENDPOINT}/user/verify-code`;

    await axios
      .post(url, {
        firstName: route.params.firstName,
        lastName: route.params.lastName,
        phoneNumber: route.params.phoneNumber,

        password: route.params.password,
        county: route.params.county,
        subCounty: route.params.subCounty,
        verificationCode: otp,
      })
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: "Phone number verified successfully. Please login",
          });
          navigation.navigate("Login");
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={postStyles.holdingContainer}>
        <Text style={styles.label}>Enter code</Text>

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

        <PrimaryButton
          disabled={submitting}
          onPress={verifyCode}
          buttonTitle="Submit"
          submitting={submitting}
        />

        <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Didn't recieve code ?</Text>
          <TouchableOpacity>
            <Text style={styles.opt2Text}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const otpStyles = StyleSheet.create({});

import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Entypo } from "@expo/vector-icons";

import styles from "../../../componets/styles/global-styles";
import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";

import { showMyToast } from "../../../functions/show-toast";
import { postStyles } from "../../seller/post-product";

export default function ResetPassword({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function resetPassword() {
    const url = `${process.env.ENDPOINT}/user/send-reset-pass-otp`;

    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Please enter a phone number",
      });
    } else {
      setSubmitting(true);
      await axios
        .post(url, { phoneNumber })
        .then((response) => {
          setSubmitting(false);
          console.log(response.data);

          if (response.data.status == "Success") {
            navigation.navigate("NewPassword", { phoneNumber });
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
            setPhoneNumber("");
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
          setPhoneNumber("");
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
          Enter the phone number used to create your account. A one time
          password whill be sent that will be used to reset you password.
        </Text>

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

        <PrimaryButton
          submitting={submitting}
          disabled={submitting}
          onPress={resetPassword}
          buttonTitle="Submit"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const resetStyles = StyleSheet.create({});

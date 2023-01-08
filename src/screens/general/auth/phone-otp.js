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

export default function PhoneOtp() {
  const [otp, setOtp] = useState("");

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

        <PrimaryButton buttonTitle="Signup" />

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

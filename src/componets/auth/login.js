import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from "react-native";
import React from "react";

import styles from "../styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";

export default function LoginComponent(props) {
  const phoneNumber = props.phoneNumber;
  const setPhoneNumber = props.setPhoneNumber;
  const password = props.password;
  const setPassword = props.setPassword;

  const submitting = props.submitting;
  const onSignupPress = props.onSignupPress;

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
        onPress={props.loginPress}
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
    width: "100%",
    alignSelf: "center",
  },
});

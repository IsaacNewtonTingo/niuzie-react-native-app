import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

import styles from "../styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";

export default function SignUpComponent(props) {
  const firstName = props.firstName;
  const setFirstName = props.setFirstName;
  const lastName = props.lastName;
  const setLastName = props.setLastName;
  const email = props.email;
  const setEmail = props.setEmail;
  const confirmPassword = props.confirmPassword;
  const setConfirmPassword = props.setConfirmPassword;

  const phoneNumber = props.phoneNumber;
  const setPhoneNumber = props.setPhoneNumber;
  const password = props.password;
  const setPassword = props.setPassword;

  const submitting = props.submitting;
  const onLoginPress = props.onLoginPress;

  return (
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
        <Entypo name="mail" size={18} color="black" style={styles.searchIcon} />
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
        onPress={props.signupPress}
        buttonTitle="Signup"
        submitting={submitting}
      />

      <View style={styles.optTextSign}>
        <Text style={styles.firstText}>Already have an account ?</Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text style={styles.opt2Text}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const signStyles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: colors.cardColor,
    width: "100%",
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  holdingContainer: {
    backgroundColor: colors.cardColor,
    padding: 40,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
  },
});

import {
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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

  const confirmCodeModal = props.confirmCodeModal;
  const setConfirmCodeModal = props.setConfirmCodeModal;
  const verifyCode = props.verifyCode;

  const [otp, setOtp] = useState("");

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

      <BottomSheet
        visible={confirmCodeModal}
        onBackButtonPress={() => setConfirmCodeModal(false)}
        onBackdropPress={() => setConfirmCodeModal(false)}
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
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  holdingContainer: {
    backgroundColor: colors.cardColor,
    padding: 40,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
});

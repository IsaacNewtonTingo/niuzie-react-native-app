import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";

import { Avatar } from "react-native-paper";

import styles from "../../../componets/styles/global-styles";
import SettingsList, {
  settingsListStyles,
} from "../../../componets/cards/settings-list";

import colors from "../../../componets/colors/colors";

import { AntDesign } from "@expo/vector-icons";
import { CredentialsContext } from "../../../componets/context/credentials-context";

import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import LoginComponent from "../../../componets/auth/login";

import { showMyToast } from "../../../functions/show-toast";
import { BottomSheet } from "react-native-btr";

import SignUpComponent from "../../../componets/auth/signup";

import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import noImage from "../../../assets/data/noImage";

import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";

export default function Settings({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [loginItem, setLoginItem] = useState(true);
  const [signupItem, setSignupItem] = useState(false);

  const adminSettingList = [
    {
      title: "My products",
      iconType: "FontAwesome5",
      iconName: "luggage-cart",
      navTo: "MyProducts",
    },
    {
      title: "Saved products",
      iconType: "FontAwesome5",
      iconName: "save",
      navTo: "SavedProducts",
    },

    {
      title: "Premium services",
      iconType: "FontAwesome5",
      iconName: "crown",
      navTo: "PremiumServices",
    },
    {
      title: "Transaction",
      iconType: "MaterialCommunityIcons",
      iconName: "hand-coin",
      navTo: "Payments",
    },
    {
      title: "Support",
      iconType: "MaterialIcons",
      iconName: "support-agent",
      navTo: "ContactUs",
    },
    {
      title: "Admin panel",
      iconType: "MaterialIcons",
      iconName: "admin-panel-settings",
      navTo: "Admin",
    },
    {
      title: "Logout",
      iconType: "MaterialCommunityIcons",
      iconName: "logout",
      navTo: "Logout",
    },
  ];

  const regularSettingList = [
    {
      title: "My products",
      iconType: "FontAwesome5",
      iconName: "luggage-cart",
      navTo: "MyProducts",
    },
    {
      title: "Saved products",
      iconType: "FontAwesome5",
      iconName: "save",
      navTo: "SavedProducts",
    },

    {
      title: "Premium services",
      iconType: "FontAwesome5",
      iconName: "crown",
      navTo: "PremiumServices",
    },
    {
      title: "Transaction",
      iconType: "MaterialCommunityIcons",
      iconName: "hand-coin",
      navTo: "Payments",
    },
    {
      title: "Support",
      iconType: "MaterialIcons",
      iconName: "support-agent",
      navTo: "ContactUs",
    },
    {
      title: "Logout",
      iconType: "MaterialCommunityIcons",
      iconName: "logout",
      navTo: "Logout",
    },
  ];

  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  const [isChecked, setChecked] = useState(false);

  const [confirmCodeModal, setConfirmCodeModal] = useState(false);
  const [resetPasswordOtpModal, setResetPasswordOtpModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  const [otp, setOtp] = useState("");
  const [reseOtp, setResetOtp] = useState("");

  useEffect(() => {
    checkStoreCredentials();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function login() {
    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "First name is required. Please add a name then proceed",
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

            setAdmin(response.data.data.admin);

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
        setPassword("");
        setStoredCredentials(values);
        getUserData(values.data.userID, values.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
    } else if (!county) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "County is required. Please add your county then proceed",
      });
    } else if (!subCounty) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Sub county is required. Please add your subcounty then proceed.",
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
    } else if (isChecked == false) {
      showMyToast({
        status: "error",
        title: "Terms and conditions",
        description:
          "You must accept terms and conditions to complete the signup process",
      });
    } else {
      const url = `${process.env.ENDPOINT}/user/signup`;
      setSubmitting(true);

      await axios
        .post(url, {
          phoneNumber,
        })
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);

          if (response.data.status == "Success") {
            setConfirmCodeModal(true);
            showMyToast({
              status: "succes",
              title: "Success",
              description: response.data.messsage,
            });
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.messsage,
            });
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
        phoneNumber,
        password,
        verificationCode: otp,
      })
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);

        if (response.data.status == "Success") {
          setConfirmCodeModal(false);
          setLoginItem(true);
          setSignupItem(false);

          showMyToast({
            status: "success",
            title: "Success",
            description: "Phone number verified successfully. Please login",
          });
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

  async function checkStoreCredentials() {
    const { data } = storedCredentials ? storedCredentials : "";

    if (data) {
      setUserID(data.userID);
      setToken(data.token);

      getUserData(data.userID, data.token);
    } else {
      setUserID("");
      setToken("");
      setLoadingData(false);
    }
  }

  async function getUserData(userID, token) {
    setLoadingData(true);
    const url = `${process.env.ENDPOINT}/user/get-user-data/${userID}`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers: headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setFirstName(response.data.data.firstName);
          setLastName(response.data.data.lastName);
          setPhoneNumber(response.data.data.phoneNumber);
          setProfilePicture(response.data.data.profilePicture);

          setAdmin(response.data.data.admin);
        } else {
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  async function handleSettingPressed(navTo) {
    if (navTo == "MyProducts") {
      navigation.navigate(navTo, {
        firstName,
        lastName,
        phoneNumber,
        userID,
      });
    } else if (navTo == "SavedProducts") {
      navigation.navigate("SavedProducts");
    } else if (navTo == "PremiumServices") {
      navigation.navigate("PremiumServices");
    } else if (navTo == "Payments") {
      navigation.navigate("Payments");
    } else if (navTo == "ContactUs") {
      navigation.navigate("ContactUs", {
        firstName,
        lastName,
        phoneNumber,
        userID,
      });
    } else if (navTo == "Admin") {
      navigation.navigate("AdminDashboard");
    } else if (navTo == "Logout") {
      handleLogout();
    }
  }

  async function handleLogout() {
    setLoadingData(true);
    await SecureStore.deleteItemAsync("loginCredentials")
      .then(async () => {
        setLoadingData(false);
        setStoredCredentials("");

        setPhoneNumber("");
        setPassword("");
        setResetOtp("");
        setFirstName("");
        setLastName("");
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  function onSignupPress() {
    setLoginItem(false);
    setSignupItem(true);
  }

  function onLoginPress() {
    setLoginItem(true);
    setSignupItem(false);
  }

  async function resetPassword() {
    const url = `${process.env.ENDPOINT}/user/send-reset-pass-otp`;

    setSubmitting(true);
    await axios
      .post(url, { phoneNumber })
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          setResetPasswordOtpModal(false);
          setResetPasswordModal(true);
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

  async function changePassword() {
    const url = `${process.env.ENDPOINT}/user/change-password`;
    setSubmitting(true);

    if (!reseOtp) {
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
    } else if (password !== confirmPassword) {
      showMyToast({
        status: "error",
        title: "Password mismatch",
        description: "Passwords don't match",
      });
    } else {
      await axios
        .post(url, { phoneNumber, otp: reseOtp, password })
        .then((response) => {
          setSubmitting(false);
          console.log(response.data);

          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message + ". Please login",
            });
            setResetPasswordOtpModal(false);
            setResetPasswordModal(false);
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
            setPhoneNumber("");
            setPassword("");
            setResetOtp("");
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
          setPhoneNumber("");
          setPassword("");
          setResetOtp("");
        });
    }
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={[
        styles.container,
        { padding: 10, paddingTop: StatusBar.currentHeight + 20 },
      ]}
    >
      {!storedCredentials ? (
        <>
          <View style={{ backgroundColor: colors.almostDark, width: "100%" }}>
            <TouchableOpacity
              onPress={async () => await Updates.reloadAsync()}
              style={{
                alignSelf: "flex-end",
                top: 20,
                right: 20,
              }}
            >
              <Text style={{ color: colors.orange, fontWeight: "800" }}>
                Cancel
              </Text>
            </TouchableOpacity>

            {loginItem == true ? (
              <LoginComponent
                submitting={submitting}
                loginPress={login}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                password={password}
                setPassword={setPassword}
                onSignupPress={onSignupPress}
                resetPasswordOtpModal={resetPasswordOtpModal}
                setResetPasswordOtpModal={setResetPasswordOtpModal}
              />
            ) : signupItem == true ? (
              <SignUpComponent
                submitting={submitting}
                onLoginPress={onLoginPress}
                signupPress={signUp}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                confirmCodeModal={confirmCodeModal}
                setConfirmCodeModal={setConfirmCodeModal}
                verifyCode={verifyCode}
                county={county}
                setCounty={setCounty}
                subCounty={subCounty}
                setSubCounty={setSubCounty}
                isChecked={isChecked}
                setChecked={setChecked}
              />
            ) : (
              <></>
            )}
          </View>

          <BottomSheet
            visible={confirmCodeModal}
            // onBackButtonPress={() => setConfirmCodeModal(false)}
            // onBackdropPress={() => setConfirmCodeModal(false)}
          >
            <View style={settingsStyls.bottomNavigationView}>
              <Text
                style={[
                  styles.label,
                  { textAlign: "center", marginVertical: 20 },
                ]}
              >
                Enter verification code sent to your phone number to finish
                setting up your account
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
                  style={[
                    styles.textInput,
                    { color: colors.dark, width: "100%" },
                  ]}
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

          <BottomSheet
            visible={resetPasswordOtpModal}
            onBackButtonPress={() => setResetPasswordOtpModal(false)}
            onBackdropPress={() => setResetPasswordOtpModal(false)}
          >
            <View style={settingsStyls.bottomNavigationView}>
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: 20,
                  fontWeight: "800",
                  color: colors.gray,
                }}
              >
                Enter your phone number to receive an otp to proceed with the
                password reset process
              </Text>

              {/* <Text style={styles.label}>Phone number</Text> */}
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
                  placeholderTextColor={colors.gray}
                  keyboardType="phone-pad"
                />
              </View>

              <PrimaryButton
                disabled={submitting}
                submitting={submitting}
                onPress={resetPassword}
                buttonTitle="Submit"
              />
            </View>
          </BottomSheet>

          <BottomSheet
            visible={resetPasswordModal}
            onBackButtonPress={() => setResetPasswordModal(false)}
            onBackdropPress={() => setResetPasswordModal(false)}
          >
            <View style={settingsStyls.bottomNavigationView}>
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: 20,
                  fontWeight: "800",
                  color: colors.gray,
                }}
              >
                Enter the otp sent to your phone to complete password reset
                process.
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
                  value={reseOtp}
                  onChangeText={setResetOtp}
                  style={[
                    styles.textInput,
                    { color: colors.dark, width: "100%" },
                  ]}
                  placeholder="e.g 2763"
                  keyboardType="numeric"
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
                submitting={submitting}
                onPress={changePassword}
                buttonTitle="Submit"
              />

              <View style={styles.optTextSign}>
                <Text style={styles.firstText}>Didn't recieve code ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    setResetPasswordModal(false),
                      setResetPasswordOtpModal(true);
                  }}
                >
                  <Text style={styles.opt2Text}>Check phone number</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheet>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                firstName,
                lastName,
                phoneNumber,
              })
            }
            style={[
              settingsListStyles.btn,
              {
                minHeight: 80,
                marginBottom: 20,
                backgroundColor: colors.almostDark,
              },
            ]}
          >
            <View style={settingsListStyles.close}>
              <Avatar.Image
                style={{ marginRight: 20 }}
                size={50}
                source={{
                  uri: profilePicture ? profilePicture : noImage.noProfilePic,
                }}
              />

              <View>
                <Text style={settingsStyls.name}>
                  {firstName} {lastName}
                </Text>
                <Text style={settingsStyls.prof}>View profile</Text>
              </View>
            </View>

            <AntDesign name="right" size={16} color={colors.gray} />
          </TouchableOpacity>

          {admin == true ? (
            <>
              {adminSettingList.map((item) => (
                <SettingsList
                  onPress={() => {
                    handleSettingPressed(item.navTo);
                  }}
                  key={item.title}
                  iconName={item.iconName}
                  iconType={item.iconType}
                  title={item.title}
                />
              ))}
            </>
          ) : (
            <>
              {regularSettingList.map((item) => (
                <SettingsList
                  onPress={() => {
                    handleSettingPressed(item.navTo);
                  }}
                  key={item.title}
                  iconName={item.iconName}
                  iconType={item.iconType}
                  title={item.title}
                />
              ))}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}
const settingsStyls = StyleSheet.create({
  name: {
    color: colors.lightBlue,
    fontWeight: "800",
  },
  prof: {
    color: colors.gray,
    fontWeight: "800",
    marginTop: 5,
  },
  bottomNavigationView: {
    backgroundColor: colors.cardColor,
    width: "100%",
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

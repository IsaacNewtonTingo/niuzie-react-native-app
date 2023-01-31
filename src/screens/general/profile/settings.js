import {
  ScrollView,
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
import PrimaryButton from "../../../componets/buttons/primary-button";

export default function Settings({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [loginItem, setLoginItem] = useState(true);
  const [signupItem, setSignupItem] = useState(false);

  const settingList = [
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmCodeModal, setConfirmCodeModal] = useState(false);

  const [otp, setOtp] = useState("");

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

            const { data } = response.data;
            storeCredentials({ data });

            if (response.data.data.admin == true) {
              navigation.navigate("AdminDashboard");
            }
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
    const url = `https://a54a-105-163-2-113.eu.ngrok.io/api/user/verify-code`;

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
          setEmail(response.data.data.email);
        } else {
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
          setEmail("");
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
        email,
        userID,
      });
    } else if (navTo == "SavedProducts") {
      navigation.navigate("SavedProducts");
    } else if (navTo == "PremiumServices") {
      navigation.navigate("PremiumServices");
    } else if (navTo == "Payments") {
      navigation.navigate("Payments");
    } else if (navTo == "ContactUs") {
      navigation.navigate("Support");
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

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={[styles.container, { padding: 20 }]}
    >
      {!storedCredentials ? (
        <>
          <View style={{ backgroundColor: colors.almostDark, width: "100%" }}>
            <TouchableOpacity
              onPress={async () => await Updates.reloadAsync()}
              style={{ alignSelf: "flex-end", right: 20, marginBottom: 20 }}
            >
              <Text style={{ color: colors.orange, fontWeight: "800" }}>
                Close
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
              />
            ) : signupItem == true ? (
              <SignUpComponent
                submitting={submitting}
                onLoginPress={onLoginPress}
                signupPress={signUp}
                firstName={firstName}
                setFirstName={setFirstName}
                email={email}
                setEmail={setEmail}
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
              />
            ) : (
              <></>
            )}
          </View>

          <BottomSheet
            visible={confirmCodeModal}
            onBackButtonPress={() => setConfirmCodeModal(false)}
            onBackdropPress={() => setConfirmCodeModal(false)}
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
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                firstName,
                lastName,
                email,
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
                source={require("../../../assets/images/tabs.jpg")}
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

          {settingList.map((item) => (
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

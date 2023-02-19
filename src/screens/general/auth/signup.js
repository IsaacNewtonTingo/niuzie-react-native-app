import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { BottomSheet } from "react-native-btr";

import styles from "../../../componets/styles/global-styles";

import {
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showMyToast } from "../../../functions/show-toast";

import Checkbox from "expo-checkbox";
import { HStack } from "native-base";
import PostSubCategoryList from "../../../componets/subcategories/post-sub-cat-list";
import NoData from "../../../componets/Text/no-data";

const countiesData = require("../../../assets/data/counties2.json");

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [isChecked, setChecked] = useState(false);

  const [subCounties, setSubCounties] = useState([]);

  const [countiesModal, setCountiesModal] = useState(false);
  const [subCountiesModal, setSubCountiesModal] = useState(false);

  var phoneNumberRegex = /^(\+254|0)[17]\d{8}$/;

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
    } else if (!phoneNumberRegex.test(phoneNumber)) {
      showMyToast({
        status: "error",
        title: "Invalid input",
        description:
          "Invalid phone number. Make sure phone number is in the format 07xxxxxxxx / 01xxxxxxxx / +2547xxxxxxxx / +2541xxxxxxxx",
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
      const newPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber.substring(1)
        : phoneNumber.startsWith("0")
        ? "254" + phoneNumber.substring(1)
        : phoneNumber;

      await axios
        .post(url, {
          phoneNumber: parseInt(newPhoneNumber),
        })
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);

          if (response.data.status == "Success") {
            navigation.navigate("ConfirmOtp", {
              firstName,
              lastName,
              phoneNumber,
              password,
              county,
              subCounty,
            });
            showMyToast({
              status: "succes",
              title: "Success",
              description: response.data.messsage,
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
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
    >
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
        <Text style={styles.label}>County</Text>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons
            name="city"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TouchableOpacity
            style={[
              styles.textInput,
              { color: colors.dark, justifyContent: "center" },
            ]}
            onPress={() => setCountiesModal(true)}
          >
            <Text>{county}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Sub county</Text>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons
            name="city-variant"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TouchableOpacity
            style={[
              styles.textInput,
              { color: colors.dark, justifyContent: "center" },
            ]}
            onPress={() => setSubCountiesModal(true)}
          >
            <Text>{subCounty}</Text>
          </TouchableOpacity>
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

        <View style={signStyles.section}>
          <Checkbox
            style={signStyles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <HStack>
            <Text style={signStyles.paragraph}>I accept </Text>

            <TouchableOpacity>
              <Text style={[signStyles.paragraph, { color: colors.linkText }]}>
                terms & conditions
              </Text>
            </TouchableOpacity>
          </HStack>
        </View>

        <PrimaryButton
          disabled={submitting}
          onPress={signUp}
          buttonTitle="Signup"
          submitting={submitting}
        />
        <View style={styles.optTextSign}>
          <Text style={styles.firstText}>Already have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.opt2Text}>Login</Text>
          </TouchableOpacity>
        </View>

        <BottomSheet
          onBackButtonPress={() => setCountiesModal(false)}
          onBackdropPress={() => setCountiesModal(false)}
          visible={countiesModal}
        >
          <View style={signStyles.bottomSheet}>
            <TouchableOpacity
              style={signStyles.cancel}
              onPress={() => setCountiesModal(false)}
            >
              <Text style={signStyles.close}>Cancel</Text>
            </TouchableOpacity>

            <FlatList
              data={countiesData}
              renderItem={({ item }) => (
                <PostSubCategoryList
                  key={item.code}
                  onPress={() => {
                    setCounty(item.name);
                    setSubCounties(item.sub_counties);
                    setSubCounty("");
                    setCountiesModal(false);
                  }}
                  subCategoryName={item.name}
                />
              )}
            />

            {countiesData.length < 1 && <NoData text="No data" />}
          </View>
        </BottomSheet>

        <BottomSheet
          visible={subCountiesModal}
          onBackButtonPress={() => setSubCountiesModal(false)}
          onBackdropPress={() => setSubCountiesModal(false)}
        >
          <View style={signStyles.bottomSheet}>
            <TouchableOpacity
              style={signStyles.cancel}
              onPress={() => setSubCountiesModal(false)}
            >
              <Text style={signStyles.close}>Cancel</Text>
            </TouchableOpacity>

            <FlatList
              data={subCounties}
              renderItem={({ item, i }) => (
                <PostSubCategoryList
                  key={i}
                  onPress={() => {
                    setSubCounty(item);
                    setSubCountiesModal(false);
                  }}
                  subCategoryName={item}
                />
              )}
            />

            {!county && <NoData text="Please select county first" />}
          </View>
        </BottomSheet>
      </View>
    </KeyboardAwareScrollView>
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
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.lightBlue,
  },
  checkbox: {
    margin: 8,
  },
  bottomSheet: {
    backgroundColor: colors.cardColor,
    width: width,
    borderRadius: 10,
    padding: 10,
    bottom: 0,
    height: height / 2,
    alignSelf: "center",
    position: "absolute",
    zIndex: 2,
  },
  close: {
    color: colors.orange,
    fontWeight: "800",
  },
  cancel: {
    width: "100%",
    flexDirection: "row-reverse",
    padding: 20,
  },
});

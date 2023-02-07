import {
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import styles from "../../../componets/styles/global-styles";
import { LinearGradient } from "expo-linear-gradient";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";

import { postStyles } from "../../seller/post-product";
import { BottomSheet } from "react-native-btr";
import noImage from "../../../assets/data/noImage";
import { Avatar } from "react-native-paper";

import PostSubCategoryList from "../../../componets/subcategories/post-sub-cat-list";
import { discoverStyles } from "../../general/dashboard/discover";
import { showMyToast } from "../../../functions/show-toast";

const countiesData = require("../../../assets/data/counties.json");

const { width } = Dimensions.get("window");

export default function EditAdminProfile({ route }) {
  const [firstName, setFirstName] = useState(route.params.firstName);
  const [lastName, setLastName] = useState(route.params.lastName);
  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
  const [profilePicture, setProfilePicture] = useState(
    route.params.profilePicture
  );
  const [county, setCounty] = useState(route.params.county);
  const [subCounty, setSubCounty] = useState(route.params.subCounty);

  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [changePassModal, setChangePassModal] = useState(false);
  const [otpPassModal, setOtpPassModal] = useState(false);

  const [countiesModal, setCountiesModal] = useState(false);
  const [subCountiesModal, setSubCountiesModal] = useState(false);
  const [subCounties, setSubCounties] = useState([]);

  async function validate() {
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
    } else {
      setOtpPassModal(true);
    }
  }

  async function initiateOTP() {}

  async function editProfile() {
    setSubmitting(false);

    const url = `${process.env.ENDPOINT}/user/edit-profile/${userID}`;

    await axios
      .post(url, {}, { headers })
      .then((response) => {
        setSubmitting(false);

        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  }

  async function changePassword() {}

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={editProfileStyles.bg}
        source={require("../../../assets/images/bg.jpg")}
      >
        <Avatar.Image
          size={200}
          source={{
            uri: profilePicture ? profilePicture : noImage.noProfilePic,
          }}
        />
      </ImageBackground>

      <View style={postStyles.holdingContainer}>
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
            value={phoneNumber.toString()}
            onChangeText={setPhoneNumber}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g +254724753175"
            keyboardType="phone-pad"
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

        <PrimaryButton onPress={validate} buttonTitle="Edit profile" />

        <TouchableOpacity onPress={() => setChangePassModal(true)}>
          <Text
            style={{
              color: colors.orange,
              textAlign: "center",
              fontWeight: "800",
              marginVertical: 20,
            }}
          >
            Change password
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        visible={otpPassModal}
        onBackButtonPress={() => setOtpPassModal(false)}
        onBackdropPress={() => setOtpPassModal(false)}
      >
        <LinearGradient
          colors={[colors.cardColor, colors.dark]}
          style={editProfileStyles.bottomNavigationView}
        >
          <Text style={styles.label}>OTP</Text>
          <View style={styles.textInputContainer}>
            <MaterialCommunityIcons
              name="numeric-4-box-multiple"
              size={18}
              color="black"
              style={styles.searchIcon}
            />
            <TextInput
              value={otp}
              onChangeText={setOtp}
              style={[styles.textInput, { color: colors.dark }]}
              placeholder="e.g 2365"
              placeholderTextColor="gray"
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
              placeholder="********"
              placeholderTextColor="gray"
              secureTextEntry={true}
            />
          </View>

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={editProfile}
            buttonTitle="Submit"
          />
        </LinearGradient>
      </BottomSheet>

      <BottomSheet
        visible={changePassModal}
        onBackButtonPress={() => setChangePassModal(false)}
        onBackdropPress={() => setChangePassModal(false)}
      >
        <LinearGradient
          colors={[colors.cardColor, colors.dark]}
          style={editProfileStyles.bottomNavigationView}
        >
          <Text style={styles.label}>Old password</Text>
          <View style={styles.textInputContainer}>
            <FontAwesome5
              name="lock"
              size={18}
              color="black"
              style={styles.searchIcon}
            />
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              style={[styles.textInput, { color: colors.dark }]}
              placeholder="*******"
              placeholderTextColor="gray"
              secureTextEntry={true}
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
              value={newPassword}
              onChangeText={setNewPassword}
              style={[styles.textInput, { color: colors.dark }]}
              placeholder="********"
              placeholderTextColor="gray"
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
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              style={[styles.textInput, { color: colors.dark }]}
              placeholder="********"
              placeholderTextColor="gray"
              secureTextEntry={true}
            />
          </View>

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={changePassword}
            buttonTitle="Submit"
          />
        </LinearGradient>
      </BottomSheet>

      {countiesModal == true && (
        <View
          setCountiesModal={setCountiesModal}
          style={discoverStyles.backdrop}
        >
          <TouchableOpacity
            style={discoverStyles.cancel}
            onPress={() => setCountiesModal(false)}
          >
            <Text style={discoverStyles.close}>Cancel</Text>
          </TouchableOpacity>

          {countiesData.map((item) => (
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
          ))}

          {countiesData.length < 1 && <NoData text="No data" />}
        </View>
      )}

      {subCountiesModal == true && (
        <View style={discoverStyles.backdrop}>
          <TouchableOpacity
            style={discoverStyles.cancel}
            onPress={() => setSubCountiesModal(false)}
          >
            <Text style={discoverStyles.close}>Cancel</Text>
          </TouchableOpacity>

          {subCounties.map((item, i) => (
            <PostSubCategoryList
              key={i}
              onPress={() => {
                setSubCounty(item);
                setSubCountiesModal(false);
              }}
              subCategoryName={item}
            />
          ))}

          {!county && <NoData text="Please select county first" />}
          {subCounties.length < 1 && <NoData text="No data" />}
        </View>
      )}
    </ScrollView>
  );
}

const editProfileStyles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
  detailsContainer: {
    width: "100%",
    borderRadius: 10,
    height: 400,
    padding: 20,
    paddingTop: 80,
    top: 120,
    marginBottom: 200,
  },
  bottomNavigationView: {
    backgroundColor: colors.cardColor,
    width: "100%",
    padding: 40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  bg: {
    width: width,
    height: width / 1.7,
    alignItems: "center",
    justifyContent: "center",
  },
});

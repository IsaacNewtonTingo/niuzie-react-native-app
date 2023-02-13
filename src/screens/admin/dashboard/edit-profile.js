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
  FlatList,
} from "react-native";
import React, { useState } from "react";
import styles from "../../../componets/styles/global-styles";
import { LinearGradient } from "expo-linear-gradient";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import * as ImagePicker from "expo-image-picker";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const countiesData = require("../../../assets/data/counties2.json");

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function EditAdminProfile({ route, navigation }) {
  const [firstName, setFirstName] = useState(route.params.firstName);
  const [lastName, setLastName] = useState(route.params.lastName);
  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
  const [profilePicture, setProfilePicture] = useState(
    route.params.profilePicture
  );
  const [newProfilePicture, setNewprofilePicture] = useState(null);

  const [county, setCounty] = useState(route.params.county);
  const [subCounty, setSubCounty] = useState(route.params.subCounty);

  const token = route.params.token;
  const userID = route.params.userID;

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

  const headers = {
    "auth-token": token,
  };

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
    } else if (!password) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Password is required. Please add a password then proceed",
      });
    } else {
      initiateOTP();
    }
  }

  async function initiateOTP() {
    setSubmitting(true);
    const url = `${process.env.ENDPOINT}/user/edit-profile/${userID}`;

    await axios
      .post(url, { phoneNumber, password }, { headers })
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);

        if (response.data.status == "Success") {
          setOtpPassModal(true);
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
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  }

  async function editProfile() {
    setSubmitting(true);

    const url = `${process.env.ENDPOINT}/user/update-profile/${userID}`;

    await axios
      .put(
        url,
        {
          firstName,
          lastName,
          county,
          subCounty,
          phoneNumber,
          password,
          otp,
          profilePicture:
            newProfilePicture !== null ? await uploadImage() : profilePicture,
        },
        { headers }
      )
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);
        if (response.data.status == "Success") {
          setOtpPassModal(false);
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          setPassword("");
          setOtp("");
          setNewprofilePicture(null);
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

  async function changeDP() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.assets[0].uri);
      setNewprofilePicture(pickerResult.assets[0].uri);
    }
  }

  async function uploadImage() {
    if (newProfilePicture == null) {
      return null;
    } else {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", newProfilePicture, true);
        xhr.send(null);
      });

      let filename = newProfilePicture.substring(
        newProfilePicture.lastIndexOf("/") + 1
      );

      const fileRef = ref(storage, `images/${filename}`);
      const result = await uploadBytes(fileRef, blob);

      // We're done with the blob, close and release it
      blob.close();

      return await getDownloadURL(fileRef);
    }
  }

  async function changePassword() {
    if (!oldPassword) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Your old password is required",
      });
    } else if (!newPassword) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "New password is required",
      });
    } else if (newPassword.length < 8) {
      showMyToast({
        status: "error",
        title: "Failed",
        description: "Password is too short",
      });
    } else if (!confirmNewPassword) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Confirm new password is required",
      });
    } else if (newPassword !== confirmNewPassword) {
      showMyToast({
        status: "error",
        title: "Failed",
        description: "Passwords don't match",
      });
    } else {
      setSubmitting(true);
      const url = `${process.env.ENDPOINT}/user/update-password/${userID}`;
      await axios
        .put(
          url,
          {
            oldPassword,
            newPassword,
          },
          { headers }
        )
        .then((response) => {
          setSubmitting(false);
          console.log(response.data);
          if (response.data.status == "Success") {
            setChangePassModal(false);
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });
            setNewPassword("");
            setOldPassword("");
            setConfirmNewPassword("");
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

        <TouchableOpacity onPress={changeDP} style={{ position: "absolute" }}>
          <Entypo name="camera" size={50} color={colors.dark} />
        </TouchableOpacity>
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
            placeholderTextColor="gray"
            secureTextEntry={true}
          />
        </View>

        <PrimaryButton
          disabled={submitting}
          submitting={submitting}
          onPress={validate}
          buttonTitle="Edit profile"
        />

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

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={editProfile}
            buttonTitle="Submit"
          />

          <View style={styles.optTextSign}>
            <Text style={styles.firstText}>Didn't recieve code ?</Text>
            <TouchableOpacity>
              <Text style={styles.opt2Text}>Resend</Text>
            </TouchableOpacity>
          </View>
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

      <BottomSheet
        onBackButtonPress={() => setCountiesModal(false)}
        onBackdropPress={() => setCountiesModal(false)}
        visible={countiesModal}
      >
        <View style={editProfileStyles.bottomSheet}>
          <TouchableOpacity
            style={editProfileStyles.cancel}
            onPress={() => setCountiesModal(false)}
          >
            <Text style={editProfileStyles.close}>Cancel</Text>
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
        <View style={editProfileStyles.bottomSheet}>
          <TouchableOpacity
            style={editProfileStyles.cancel}
            onPress={() => setSubCountiesModal(false)}
          >
            <Text style={editProfileStyles.close}>Cancel</Text>
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
    </KeyboardAwareScrollView>
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

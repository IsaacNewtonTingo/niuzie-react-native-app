import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-paper";
import { FloatingAction } from "react-native-floating-action";
import { BottomSheet } from "react-native-btr";

import noImage from "../../../assets/data/noImage";

import {
  CredentialsContext,
  AuthContext,
} from "../../../componets/context/credentials-context";

import styles from "../../../componets/styles/global-styles";
import { showMyToast } from "../../../functions/show-toast";

const { width } = Dimensions.get("window");

import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as SecureStore from "expo-secure-store";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function AdminProfile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { auth, setAuth } = useContext(AuthContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const roleID = data.roleID;
  const token = data.token;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [newAdminPhoneNumber, setNewAdminPhoneNumber] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState("");

  const [addAdmin, setAddAdmin] = useState(false);
  const [editAdmin, setEditAdmin] = useState(false);

  useEffect(() => {
    getProfile();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  const headers = {
    "auth-token": token,
  };

  async function getProfile() {
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
          setPhoneNumber(`+${response.data.data.phoneNumber}`);
          setProfilePicture(response.data.data.profilePicture);
          setCounty(response.data.data.county);
          setSubCounty(response.data.data.subCounty);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  async function logout() {
    setLoadingData(true);
    await SecureStore.deleteItemAsync("loginCredentials")
      .then(async () => {
        setLoadingData(false);
        setStoredCredentials("");
        setAuth(true);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  const EditAdmin = () => {
    return <AntDesign name="edit" size={24} color={colors.lightBlue} />;
  };

  const AddAdmin = () => {
    return <Entypo name="add-user" size={24} color={colors.lightBlue} />;
  };

  const actions = [
    {
      text: "Add new admin",
      icon: <AddAdmin />,
      name: "add",
      position: 1,
    },

    {
      text: "Edit an admin",
      icon: <EditAdmin />,
      name: "edit",
      position: 3,
    },
  ];

  var phoneNumberRegex = /^(\+254|0)[17]\d{8}$/;
  async function handleAddAdmin() {
    //validate
    if (!adminFirstName) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "First name is required. Please add a name then proceed",
      });
    } else if (!adminLastName) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Last name is required. Please add a name then proceed",
      });
    } else if (!/^[a-zA-Z ]*$/.test(adminFirstName, adminLastName)) {
      showMyToast({
        status: "error",
        title: "Inavlid format",
        description: "Name should only contain characters",
      });
    } else if (!newAdminPhoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Phone number is required. Please add a phone number then proceed",
      });
    } else if (!phoneNumberRegex.test(newAdminPhoneNumber)) {
      showMyToast({
        status: "error",
        title: "Invalid input",
        description:
          "Invalid phone number. Make sure phone number is in the format 07xxxxxxxx / 01xxxxxxxx / +2547xxxxxxxx / +2541xxxxxxxx",
      });
    } else if (!newAdminPassword) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Password is required. Please add a password then proceed",
      });
    } else if (newAdminPassword.length < 8) {
      showMyToast({
        status: "error",
        title: "Invalid field",
        description: "Password should be at least 8 characters long",
      });
    } else if (newAdminPassword != newAdminConfirmPassword) {
      showMyToast({
        status: "error",
        title: "Non matching fields",
        description: "Passwords don't match",
      });
    } else {
      const newPhoneNumber = newAdminPhoneNumber.startsWith("+")
        ? newAdminPhoneNumber.substring(1)
        : newAdminPhoneNumber.startsWith("0")
        ? "254" + newAdminPhoneNumber.substring(1)
        : newAdminPhoneNumber;

      const url = `${process.env.ENDPOINT}/admin/add-admin/${userID}`;
      setSubmitting(true);
      await axios
        .post(
          url,
          {
            firstName: adminFirstName,
            lastName: adminLastName,
            phoneNumber: newPhoneNumber,
            password: newAdminPassword,
          },
          { headers }
        )
        .then((response) => {
          setSubmitting(false);

          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });
            setAddAdmin(false);
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

  async function handleActionPressed(name) {
    if (name == "add") {
      setAddAdmin(true);
    } else {
      setEditAdmin(true);
    }
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <ImageBackground
          style={profileStyles.bg}
          source={require("../../../assets/images/background.jpg")}
        >
          <Avatar.Image
            size={200}
            source={{
              uri: profilePicture ? profilePicture : noImage.noProfilePic,
            }}
          />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditAdminProfile", {
                firstName,
                lastName,
                phoneNumber,
                profilePicture,
                county,
                subCounty,
                userID,
                token,
              })
            }
            style={{ position: "absolute", bottom: -20, right: 20 }}
          >
            <FontAwesome name="edit" size={30} color={colors.linkText} />
          </TouchableOpacity>
        </ImageBackground>

        <View style={profileStyles.cont}>
          <View style={profileStyles.flee}>
            <FontAwesome name="user" size={30} color={colors.gray} />
            <View style={profileStyles.it}>
              <Text style={profileStyles.label}>First name</Text>
              <Text style={profileStyles.may}>{firstName}</Text>
            </View>
          </View>

          <View style={profileStyles.flee}>
            <FontAwesome5 name="user" size={30} color={colors.gray} />
            <View style={profileStyles.it}>
              <Text style={profileStyles.label}>Last name</Text>
              <Text style={profileStyles.may}>{lastName}</Text>
            </View>
          </View>

          <View style={profileStyles.flee}>
            <FontAwesome5
              name="phone-square-alt"
              size={30}
              color={colors.gray}
            />
            <View style={profileStyles.it}>
              <Text style={profileStyles.label}>Phone number</Text>
              <Text style={profileStyles.may}>{phoneNumber}</Text>
            </View>
          </View>

          <View style={profileStyles.flee}>
            <MaterialCommunityIcons
              name="home-city"
              size={30}
              color={colors.gray}
            />
            <View style={profileStyles.it}>
              <Text style={profileStyles.label}>County</Text>
              <Text style={profileStyles.may}>{county}</Text>
            </View>
          </View>

          <View style={profileStyles.flee}>
            <MaterialCommunityIcons
              name="home-city-outline"
              size={30}
              color={colors.gray}
            />
            <View style={profileStyles.it}>
              <Text style={profileStyles.label}>Sub county</Text>
              <Text style={profileStyles.may}>{subCounty}</Text>
            </View>
          </View>

          <PrimaryButton
            buttonTitle="Logout"
            submitting={submitting}
            disabled={submitting}
            onPress={logout}
          />
        </View>

        <BottomSheet
          visible={addAdmin}
          onBackButtonPress={() => setAddAdmin(false)}
          onBackdropPress={() => setAddAdmin(false)}
        >
          <View style={profileStyles.btmSheet}>
            <Text style={styles.label}>First name</Text>
            <View style={styles.textInputContainer}>
              <FontAwesome5
                name="user-tie"
                size={18}
                color="black"
                style={styles.searchIcon}
              />
              <TextInput
                value={adminFirstName}
                onChangeText={setAdminFirstName}
                style={[styles.textInput, { color: colors.dark }]}
                placeholder="e.g John"
                placeholderTextColor={colors.gray}
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
                value={adminLastName}
                onChangeText={setAdminLastName}
                style={[styles.textInput, { color: colors.dark }]}
                placeholder="e.g Doe"
                placeholderTextColor={colors.gray}
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
                value={newAdminPhoneNumber}
                onChangeText={setNewAdminPhoneNumber}
                style={[styles.textInput, { color: colors.dark }]}
                placeholder="e.g +254724753175"
                keyboardType="phone-pad"
                placeholderTextColor={colors.gray}
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
                value={newAdminPassword}
                onChangeText={setNewAdminPassword}
                style={[styles.textInput, { color: colors.dark }]}
                placeholder="*******"
                secureTextEntry={true}
                placeholderTextColor={colors.gray}
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
                value={newAdminConfirmPassword}
                onChangeText={setNewAdminConfirmPassword}
                style={[styles.textInput, { color: colors.dark }]}
                placeholder="********"
                secureTextEntry={true}
                placeholderTextColor={colors.gray}
              />
            </View>

            <PrimaryButton
              disabled={submitting}
              submitting={submitting}
              onPress={handleAddAdmin}
              buttonTitle="Add"
            />
          </View>
        </BottomSheet>
      </ScrollView>

      {roleID == 0 && (
        <FloatingAction
          actions={actions}
          onPressItem={(name) => {
            handleActionPressed(name);
          }}
        />
      )}
    </>
  );
}

const profileStyles = StyleSheet.create({
  bg: {
    width: width,
    height: width / 1.7,
    alignItems: "center",
    justifyContent: "center",
  },
  cont: {
    padding: 20,
  },
  label: {
    fontWeight: "800",
    color: colors.gray,
  },
  may: {
    fontWeight: "800",
    color: colors.lightBlue,
  },
  flee: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 0.18,
    borderBottomColor: colors.gray,
    paddingBottom: 20,
  },
  it: {
    marginLeft: 10,
  },
  btmSheet: {
    padding: 20,
    backgroundColor: colors.cardColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

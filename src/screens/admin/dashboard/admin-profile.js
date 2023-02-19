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
} from "react-native";
import { Avatar } from "react-native-paper";
import noImage from "../../../assets/data/noImage";

import {
  CredentialsContext,
  AuthContext,
} from "../../../componets/context/credentials-context";

import styles from "../../../componets/styles/global-styles";
import { showMyToast } from "../../../functions/show-toast";

const { width } = Dimensions.get("window");

import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as SecureStore from "expo-secure-store";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

export default function AdminProfile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { auth, setAuth } = useContext(AuthContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  useEffect(() => {
    getProfile();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

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

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={profileStyles.bg}
        source={require("../../../assets/images/bg.jpg")}
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
          <FontAwesome5 name="phone-square-alt" size={30} color={colors.gray} />
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
    </ScrollView>
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
});

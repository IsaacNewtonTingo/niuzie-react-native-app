import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";

import * as SecureStore from "expo-secure-store";

import { Avatar } from "react-native-paper";

import styles from "../../../componets/styles/global-styles";

import SettingsList, {
  settingsListStyles,
} from "../../../componets/cards/settings-list";

import colors from "../../../componets/colors/colors";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CredentialsContext,
  NotificationContext,
  AuthContext,
} from "../../../componets/context/credentials-context";

import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import { showMyToast } from "../../../functions/show-toast";

import noImage from "../../../assets/data/noImage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Settings({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { auth, setAuth } = useContext(AuthContext);

  const { notifications, setNotifications } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const regularSettingList = [
    {
      title: "My products",
      iconType: "FontAwesome5",
      iconName: "luggage-cart",
      navTo: "MyProducts",
    },
    {
      title: "My products requests",
      iconType: "MaterialCommunityIcons",
      iconName: "frequently-asked-questions",
      navTo: "MyProductRequests",
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
      title: "Notifications",
      iconType: "Ionicons",
      iconName: "notifications",
      navTo: "NotificationSettings",
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

  useEffect(() => {
    checkStoreCredentials();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function checkStoreCredentials() {
    const { data } = storedCredentials ? storedCredentials : "";

    if (data) {
      setUserID(data.userID);
      setToken(data.token);

      getUserData(data.userID, data.token);
    } else {
      showMyToast({
        status: "info",
        title: "Requirement",
        description:
          "You need to login to access this page. Signup if you don't have an account",
      });
      setAuth(true);
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
    } else if (navTo == "MyProductRequests") {
      navigation.navigate("MyProductRequests");
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
    } else if (navTo == "NotificationSettings") {
      navigation.navigate("NotificationSettings");
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
        setNotifications(0);

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
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={[styles.container, {}]}
    >
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
    </KeyboardAwareScrollView>
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

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";

import { Avatar } from "react-native-paper";

import styles from "../../../componets/styles/global-styles";
import SettingsList, {
  settingsListStyles,
} from "../../../componets/cards/settings-list";

import { postStyles } from "../../seller/post-product";
import colors from "../../../componets/colors/colors";

import { AntDesign } from "@expo/vector-icons";
import { CredentialsContext } from "../../../componets/context/credentials-context";
import axios from "axios";

export default function Settings({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";

  const [loading, setLoading] = useState(false);

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
      title: "Payments",
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
      title: "Notifications",
      iconType: "AntDesign",
      iconName: "delete",
      navTo: "NotificationSettings",
    },
    {
      title: "Logout",
      iconType: "MaterialCommunityIcons",
      iconName: "logout",
      navTo: "Logout",
    },
  ];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userID) {
      getUserData();
    }
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getUserData() {
    const url = `${process.env.ENDPOINT}/user/get-user-data/${userID}`;
    await axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "Success") {
          setFirstName(response.data.data.firstName);
          setLastName(response.data.data.lastName);
          setPhoneNumber(response.data.data.phoneNumber);
          setEmail(response.data.data.email);
        } else {
          setFirstName("");
          setLastName("");
        }
      })
      .catch((err) => {
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
    } else if (navTo == "Logout") {
      handleLogout();
    }
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("loginCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Profile", {
            firstName,
            lastName,
            email,
            phoneNumber,
          })
        }
        style={settingsListStyles.btn}
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
    </ScrollView>
  );
}
const settingsStyls = StyleSheet.create({
  name: {
    color: colors.lightBlue,
    fontWeight: "800",
  },
  prof: {
    color: "gray",
  },
});

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Avatar } from "react-native-paper";

import styles from "../../../componets/styles/global-styles";
import SettingsList, {
  settingsListStyles,
} from "../../../componets/cards/settings-list";

import { postStyles } from "../../seller/post-product";
import colors from "../../../componets/colors/colors";

import { AntDesign } from "@expo/vector-icons";

export default function Settings() {
  const settingList = [
    {
      title: "Saved products",
      iconType: "FontAwesome5",
      iconName: "save",
    },
    {
      title: "Recently viewed",
      iconType: "FontAwesome",
      iconName: "eye",
    },
    {
      title: "Premium services",
      iconType: "FontAwesome5",
      iconName: "crown",
    },
    {
      title: "Payments",
      iconType: "MaterialCommunityIcons",
      iconName: "hand-coin",
    },
    {
      title: "Support",
      iconType: "MaterialIcons",
      iconName: "support-agent",
    },
    {
      title: "Delete account",
      iconType: "AntDesign",
      iconName: "delete",
    },
    {
      title: "Logout",
      iconType: "MaterialCommunityIcons",
      iconName: "logout",
    },
  ];

  const [firstName, setFirstName] = useState("Isaac");
  const [LastName, setLastName] = useState("Tingo");

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={settingsListStyles.btn}>
        <View style={settingsListStyles.close}>
          <Avatar.Image
            style={{ marginRight: 20 }}
            size={50}
            source={require("../../../assets/images/tabs.jpg")}
          />

          <View>
            <Text style={settingsStyls.name}>
              {firstName} {LastName}
            </Text>
            <Text style={settingsStyls.prof}>View profile</Text>
          </View>
        </View>

        <AntDesign name="right" size={16} color={colors.gray} />
      </TouchableOpacity>

      {settingList.map((item) => (
        <SettingsList
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

import {
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState } from "react";
import styles from "../../../componets/styles/global-styles";
import { LinearGradient } from "expo-linear-gradient";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import colors from "../../../componets/colors/colors";
import axios from "axios";
import { postStyles } from "../../seller/post-product";

export default function EditProfile({ route }) {
  const [firstName, setFirstName] = useState(route.params.firstName);
  const [lastName, setLastName] = useState(route.params.lastName);
  const [email, setEmail] = useState(route.params.email);
  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  //sat

  return (
    <ScrollView style={styles.container}>
      <View style={postStyles.holdingContainer}>
        <Image
          source={require("../../../assets/images/tabs.jpg")}
          style={editProfileStyles.image}
        />
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

        <Text style={styles.label}>Email</Text>
        <View style={styles.textInputContainer}>
          <Entypo
            name="mail"
            size={18}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g johndoe@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <PrimaryButton
          buttonTitle="Edit profile"
          onPress={() =>
            navigation.navigate("EditProfile", {
              firstName,
              lastName,
              email,
              phoneNumber,
            })
          }
        />

        <TouchableOpacity>
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
});

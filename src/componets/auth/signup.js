import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useState } from "react";

import styles from "../styles/global-styles";

import {
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";
import PostSubCategoryList from "../subcategories/post-sub-cat-list";
import NoData from "../Text/no-data";

import Checkbox from "expo-checkbox";
import { HStack } from "native-base";

const countiesData = require("../../assets/data/counties.json");

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function SignUpComponent(props) {
  const firstName = props.firstName;
  const setFirstName = props.setFirstName;
  const lastName = props.lastName;
  const setLastName = props.setLastName;
  const confirmPassword = props.confirmPassword;
  const setConfirmPassword = props.setConfirmPassword;

  const phoneNumber = props.phoneNumber;
  const setPhoneNumber = props.setPhoneNumber;
  const password = props.password;
  const setPassword = props.setPassword;

  const submitting = props.submitting;
  const onLoginPress = props.onLoginPress;

  const isChecked = props.isChecked;
  const setChecked = props.setChecked;

  const [countiesModal, setCountiesModal] = useState(false);
  const [subCountiesModal, setSubCountiesModal] = useState(false);
  const [subCounties, setSubCounties] = useState([]);

  return (
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
          <Text>{props.county}</Text>
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
          <Text>{props.subCounty}</Text>
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
        onPress={props.signupPress}
        buttonTitle="Signup"
        submitting={submitting}
      />
      <View style={styles.optTextSign}>
        <Text style={styles.firstText}>Already have an account ?</Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text style={styles.opt2Text}>Login</Text>
        </TouchableOpacity>
      </View>
      {countiesModal == true && (
        <View setCountiesModal={setCountiesModal} style={signStyles.backdrop}>
          <TouchableOpacity
            style={signStyles.cancel}
            onPress={() => setCountiesModal(false)}
          >
            <Text style={signStyles.close}>Cancel</Text>
          </TouchableOpacity>

          {countiesData.map((item) => (
            <PostSubCategoryList
              key={item.code}
              onPress={() => {
                props.setCounty(item.name);
                setSubCounties(item.sub_counties);
                props.setSubCounty("");
                setCountiesModal(false);
              }}
              subCategoryName={item.name}
            />
          ))}

          {countiesData.length < 1 && <NoData text="No data" />}
        </View>
      )}
      {subCountiesModal == true && (
        <View style={signStyles.backdrop}>
          <TouchableOpacity
            style={signStyles.cancel}
            onPress={() => setSubCountiesModal(false)}
          >
            <Text style={signStyles.close}>Cancel</Text>
          </TouchableOpacity>

          {subCounties.map((item, i) => (
            <PostSubCategoryList
              key={i}
              onPress={() => {
                props.setSubCounty(item);
                setSubCountiesModal(false);
              }}
              subCategoryName={item}
            />
          ))}

          {!props.county && <NoData text="Please select county first" />}
          {subCounties.length < 1 && <NoData text="No data" />}
        </View>
      )}
    </View>
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
  backdrop: {
    backgroundColor: "#336699",
    width: width,
    borderRadius: 10,
    padding: 10,
    bottom: 0,
    height: height,
    alignSelf: "center",
    position: "absolute",
    paddingTop: StatusBar.currentHeight + 40,
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

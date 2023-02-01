import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import styles from "../styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PrimaryButton from "../buttons/primary-button";
import colors from "../colors/colors";
import { discoverStyles } from "../../screens/general/dashboard/discover";
import PostSubCategoryList from "../subcategories/post-sub-cat-list";
import NoData from "../Text/no-data";

const countiesData = require("../../assets/data/counties.json");

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
});

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";

import { RadioButton } from "react-native-paper";

import styles from "../../componets/styles/global-styles";
import colors from "../../componets/colors/colors";

import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import PrimaryButton from "../../componets/buttons/primary-button";
import SecondaryButton from "../../componets/buttons/secondary-button";

const { width } = Dimensions.get("window");

export default function PostProduct() {
  const [maxPosts, setMaxPosts] = useState(false);

  const [productName, setProductName] = useState("");

  const [category, setCategory] = useState("Clothes & apparel");
  const [subCategory, setSubCetCategory] = useState("Jackets");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();

  const [condition, setCondition] = useState("");

  const [firstName, setFirstName] = useState("Isaac");
  const [lastName, setLastName] = useState("Tingo");
  const [phoneNumber, setPhoneNumber] = useState("+254724753175");
  const [county, setCounty] = useState("Nairobi");
  const [subCounty, setSubCounty] = useState("Kasarani");

  const userName = firstName + " " + lastName;

  return (
    <ScrollView style={styles.container}>
      {maxPosts == true && (
        <View style={postStyles.holdingContainer}>
          <View style={postStyles.warningContainer}>
            <Text style={postStyles.warnText}>Warning !</Text>
            <Text style={postStyles.warnDetailsText}>
              You had already posted 2 products. To upload more products, you
              will need to pay KSH. 300 per product to publish them.
            </Text>
          </View>
        </View>
      )}

      <View style={postStyles.holdingContainer}>
        <View style={styles.textComb}>
          <Text style={styles.label}>Product name</Text>
          <Text style={[styles.label, { color: "gray" }]}>
            {productName.length}/20
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <FontAwesome
            style={styles.searchIcon}
            name="mobile-phone"
            size={24}
            color={colors.dark}
          />
          <TextInput
            style={styles.textInput}
            placeholder="e.g iPhone 14 pro max"
            placeholderTextColor="gray"
            value={productName}
            onChangeText={setProductName}
            maxLength={20}
          />
        </View>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={[
            styles.textInput,
            { marginVertical: 10, justifyContent: "center" },
          ]}
        >
          <Ionicons
            style={styles.searchIcon}
            name="shirt"
            size={16}
            color={colors.dark}
          />
          <Text style={postStyles.catText}>{category}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Sub category</Text>
        <TouchableOpacity
          style={[
            styles.textInput,
            { marginVertical: 10, justifyContent: "center" },
          ]}
        >
          <MaterialCommunityIcons
            style={styles.searchIcon}
            name="shoe-sneaker"
            size={20}
            color={colors.dark}
          />
          <Text style={postStyles.catText}>{subCategory}</Text>
        </TouchableOpacity>

        <View style={styles.textComb}>
          <Text style={styles.label}>Description</Text>
          <Text style={[styles.label, { color: "gray" }]}>
            {description.length}/200
          </Text>
        </View>

        <View style={styles.textInputContainer}>
          <Foundation
            style={styles.searchIcon}
            name="clipboard-notes"
            size={18}
            color={colors.dark}
          />
          <TextInput
            style={styles.textInput}
            placeholder="e.g Perfect phone for..."
            placeholderTextColor="gray"
            value={description}
            onChangeText={setDescription}
            maxLength={200}
          />
        </View>

        <Text style={styles.label}>Price (KSH.)</Text>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons
            style={styles.searchIcon}
            name="hand-coin-outline"
            size={18}
            color={colors.dark}
          />
          <TextInput
            style={styles.textInput}
            placeholder="e.g iPhone 14 pro max"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={postStyles.holdingContainer}>
        <Text style={[styles.label, { marginLeft: 10, marginBottom: 10 }]}>
          Condition
        </Text>

        <View style={postStyles.radioContainer}>
          <RadioButton
            value="New"
            status={condition === "New" ? "checked" : "unchecked"}
            onPress={() => {
              setCondition("New");
            }}
          />
          <Text style={postStyles.radioText}>New</Text>
        </View>

        <View style={postStyles.radioContainer}>
          <RadioButton
            value="Used, in working conditions"
            status={
              condition === "Used, in working conditions"
                ? "checked"
                : "unchecked"
            }
            onPress={() => {
              setCondition("Used, in working conditions");
            }}
          />
          <Text style={postStyles.radioText}>Used, in working conditions</Text>
        </View>

        <View style={postStyles.radioContainer}>
          <RadioButton
            value="Used, with minor defects"
            status={
              condition === "Used, with minor defects" ? "checked" : "unchecked"
            }
            onPress={() => {
              setCondition("Used, with minor defects");
            }}
          />
          <Text style={postStyles.radioText}>Used, with minor defects</Text>
        </View>
      </View>

      <View style={postStyles.holdingContainer}>
        <Text style={styles.label}>Add images</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={postStyles.horImaCont}
        >
          <TouchableOpacity style={postStyles.imageContainer}>
            <FontAwesome5 name="camera" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={postStyles.imageContainer}>
            <FontAwesome5 name="camera" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={postStyles.imageContainer}>
            <FontAwesome5 name="camera" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={postStyles.imageContainer}>
            <FontAwesome5 name="camera" size={24} color="black" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={postStyles.holdingContainer}>
        <Text style={styles.label}>Full name</Text>

        <SecondaryButton iconName="user" buttonTitle={userName} />

        <Text style={styles.label}>Phone number</Text>

        <SecondaryButton iconName="phone-square" buttonTitle={phoneNumber} />

        <Text style={styles.label}>County</Text>

        <SecondaryButton iconName="address-book" buttonTitle={county} />

        <Text style={styles.label}>Sub county</Text>

        <SecondaryButton iconName="address-book-o" buttonTitle={subCounty} />

        <PrimaryButton onPress={() => {}} buttonTitle="Post product" />
      </View>
    </ScrollView>
  );
}

export const postStyles = StyleSheet.create({
  holdingContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.cardColor,
    borderRadius: 10,
  },
  warningContainer: {
    borderWidth: 2,
    borderColor: "#e60000",
    borderRadius: 10,
    padding: 10,
  },
  warnText: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.orange,
    marginBottom: 20,
  },
  warnDetailsText: {
    color: colors.lightBlue,
  },
  catText: {
    color: "gray",
    fontSize: 13,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    color: colors.lightBlue,
  },
  imageContainer: {
    width: width / 5,
    height: width / 5,
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  horImaCont: {
    marginVertical: 10,
  },
});

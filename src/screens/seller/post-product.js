import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";

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
import axios from "axios";

import { CredentialsContext } from "../../componets/context/credentials-context";
import CenteredAlert from "../../componets/alerts/centered-alert";

import { BottomSheet } from "react-native-btr";

const { width } = Dimensions.get("window");

import { homeStyles } from "../general/dashboard/home";
import SubCategoryList from "../../componets/lists/sub-category-list";
import PostSubCategoryList from "../../componets/subcategories/post-sub-cat-list";

export default function PostProduct({ navigation }) {
  const [maxPosts, setMaxPosts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [subCategory, setSubCatCategory] = useState("");
  const [subCategoryID, setSubCatCategoryID] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [condition, setCondition] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

  const [loginAlert, setLoginAlert] = useState(false);
  const [showAuthComponent, setShowAuthComponent] = useState(false);

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCatSheet, setShowCatSheet] = useState(false);
  const [showSubCatSheet, setShowSubCatSheet] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const userName = firstName + " " + lastName;

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";

  useEffect(() => {
    if (userID) {
      getUserData();
      checkUserProducts();
    } else {
      setLoginAlert(true);
    }
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getUserData() {
    const url = `https://niuzie.herokuapp.com/api/user/get-user-data/${userID}`;
    await axios
      .get(url)
      .then((response) => {
        if (response.data.status == "Success") {
          setFirstName(response.data.data.firstName);
          setLastName(response.data.data.lastName);
          setPhoneNumber(response.data.data.phoneNumber);
          setCounty(response.data.data.county);
          setSubCounty(response.data.data.subCounty);
        } else {
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
          setCounty("");
          setSubCounty("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function checkUserProducts() {
    const url = `https://niuzie.herokuapp.com/api/product/get-number/${userID}`;
    await axios
      .get(url)
      .then((response) => {
        if (response.data.data >= 2) {
          setMaxPosts(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function postProduct() {
    const url = `${process.env.ENDPOINT}/product/post-product`;
    setSubmitting(true);

    await axios
      .post(url, {
        userID,
        phoneNumber,
        productName,
        category: categoryID,
        subCategory: subCategoryID,
        condition,
        description,
        price: parseInt(price),
        image1,
        image2,
        image3,
        image4,
      })
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);
        if (response.data.status == "Success") {
          setAlert(true);
          setAlertMessage(response.data.message);
          setAlertStatus("success");

          checkUserProducts();
        } else {
          setAlert(true);
          setAlertMessage(response.data.message);
          setAlertStatus("error");
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  async function handleCategory() {
    setShowBottomSheet(true);
    setShowCatSheet(true);
    setShowSubCatSheet(false);
    getCategories();
  }

  async function handleSubCategory() {
    setShowBottomSheet(true);
    setShowSubCatSheet(true);
    setShowCatSheet(false);
    getSubCategories();
  }

  async function getCategories() {
    const url = `https://niuzie.herokuapp.com/api/admin/get-categories`;

    await axios
      .get(url)
      .then((response) => {
        setCategories(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function getSubCategories() {
    const url = `https://niuzie.herokuapp.com/api/admin/get-sub-categories/${categoryID}`;

    await axios
      .get(url)
      .then((response) => {
        setSubCategories(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  return (
    <>
      {loginAlert ? (
        <View style={styles.container}>
          <View style={postStyles.holdingContainer}>
            <View style={postStyles.warningContainer}>
              <Text style={postStyles.warnText}>Unauthorized !</Text>
              <Text style={postStyles.warnDetailsText}>
                In order to post a product that you are selling or looking for,
                you need to have logged in first. If you don't have an account,
                please signup first.
              </Text>
            </View>
          </View>

          <View style={postStyles.btnsContainer}>
            <PrimaryButton
              style={{ width: "45%" }}
              buttonTitle="Login"
              onPress={() =>
                navigation.navigate("AuthNav", { screen: "Login" })
              }
            />
            <PrimaryButton
              onPress={() =>
                navigation.navigate("AuthNav", { screen: "SignUp" })
              }
              style={{
                width: "45%",
                backgroundColor: colors.dark,
                borderWidth: 1,
                borderColor: "#0066FF",
              }}
              buttonTitle="Signup"
            />
          </View>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {alert && (
            <CenteredAlert
              onPress={() => setAlert(false)}
              alertMessage={alertMessage}
              alertStatus={alertStatus}
            />
          )}

          {maxPosts == true && (
            <View style={postStyles.holdingContainer}>
              <View style={postStyles.warningContainer}>
                <Text style={postStyles.warnText}>Warning !</Text>
                <Text style={postStyles.warnDetailsText}>
                  You had already posted 2 products. To upload more products,
                  you will need to pay KSH. 300 per product to publish them.
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
              onPress={handleCategory}
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
              onPress={handleSubCategory}
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
                placeholder="e.g 1200"
                placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
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
              <Text style={postStyles.radioText}>
                Used, in working conditions
              </Text>
            </View>

            <View style={postStyles.radioContainer}>
              <RadioButton
                value="Used, with minor defects"
                status={
                  condition === "Used, with minor defects"
                    ? "checked"
                    : "unchecked"
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

            <SecondaryButton
              iconName="phone-square"
              buttonTitle={phoneNumber}
            />

            <Text style={styles.label}>County</Text>

            <SecondaryButton iconName="address-book" buttonTitle={county} />

            <Text style={styles.label}>Sub county</Text>

            <SecondaryButton
              iconName="address-book-o"
              buttonTitle={subCounty}
            />

            <PrimaryButton
              disabled={submitting}
              submitting={submitting}
              onPress={postProduct}
              buttonTitle="Post product"
            />
          </View>

          <BottomSheet
            visible={showBottomSheet}
            onBackButtonPress={() => setShowBottomSheet(false)}
            onBackdropPress={() => setShowBottomSheet(false)}
          >
            <View style={postStyles.sheetContainer}>
              {showCatSheet ? (
                <View style={homeStyles.miniCatContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCategory(category.categoryName);
                        setCategoryID(category._id);

                        setSubCatCategory("");
                        setSubCatCategoryID("");
                        setShowBottomSheet(false);
                      }}
                      style={homeStyles.miniCatItem}
                      key={category._id}
                    >
                      <Image
                        style={homeStyles.categoryImage}
                        source={{ uri: category.categoryImage }}
                      />
                      <Text style={homeStyles.categoryText}>
                        {category.categoryName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : showSubCatSheet ? (
                <FlatList
                  data={subCategories}
                  renderItem={({ item }) => (
                    <PostSubCategoryList
                      onPress={() => {
                        setSubCatCategory(item.subCategoryName);
                        setSubCatCategoryID(item._id);
                        setShowBottomSheet(false);
                      }}
                      subCategoryID={item._id}
                      subCategoryName={item.subCategoryName}
                    />
                  )}
                />
              ) : (
                <></>
              )}
            </View>
          </BottomSheet>
        </ScrollView>
      )}
    </>
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
    color: colors.dark,
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
  btnsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  sheetContainer: {
    backgroundColor: colors.lightBlue,
    width: "100%",
    paddingVertical: 40,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 10,
  },
});

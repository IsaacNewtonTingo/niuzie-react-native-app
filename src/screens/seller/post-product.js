import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";

import * as SecureStore from "expo-secure-store";

import { RadioButton } from "react-native-paper";
import { Text, Button, Modal } from "native-base";

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

import { BottomSheet } from "react-native-btr";

const { width } = Dimensions.get("window");

import { homeStyles } from "../general/dashboard/home";
import { showMyToast } from "../../functions/show-toast";

import PostSubCategoryList from "../../componets/subcategories/post-sub-cat-list";
import LoadingIndicator from "../../componets/preloader/loadingIndicator";
import StaticAlert from "../../componets/alerts/static-alert";
import { BarIndicator } from "react-native-indicators";
import AuthModal from "../../componets/modal/auth-modal";
import LoginComponent from "../../componets/auth/login";

export default function PostProduct({ navigation }, props) {
  const [maxPosts, setMaxPosts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const [password, setPassword] = useState("");

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCatSheet, setShowCatSheet] = useState(false);
  const [showSubCatSheet, setShowSubCatSheet] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [paymentModal, setPaymentModal] = useState(false);

  const userName = firstName + " " + lastName;

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [premiumUser, setPremiumUser] = useState(false);

  const onSignupPress = props.onSignupPress;

  useEffect(() => {
    checkStoreCredentials();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function login() {
    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "First name is required. Please add a name then proceed",
      });
    } else if (!password) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Password is required. Please add a password then proceed",
      });
    } else {
      setSubmitting(true);
      const url = `${process.env.ENDPOINT}/user/login`;
      await axios
        .post(url, {
          phoneNumber: parseInt(phoneNumber),
          password,
        })
        .then((response) => {
          setSubmitting(false);
          if (response.data.status == "Success") {
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });

            const { data } = response.data;
            storeCredentials({ data });
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
          }
        })
        .catch((err) => {
          setSubmitting(false);
          console.log(err);
        });
    }
  }

  async function storeCredentials(values) {
    await SecureStore.setItemAsync("loginCredentials", JSON.stringify(values))
      .then(() => {
        setStoredCredentials(values);
        getUserData(values.data.userID, values.data.token);
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function checkStoreCredentials() {
    const { data } = storedCredentials ? storedCredentials : "";

    if (data) {
      setUserID(data.userID);
      setToken(data.token);
      setPremiumUser(data.premiumUser);

      getUserData(data.userID, data.token);
    } else {
      setUserID("");
      setToken("");
      setLoadingData(false);
    }
  }

  async function getUserData(userID, token) {
    const url = `${process.env.ENDPOINT}/user/get-user-data/${userID}`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers: headers })
      .then((response) => {
        if (response.data.status == "Success") {
          setFirstName(response.data.data.firstName);
          setLastName(response.data.data.lastName);
          setPhoneNumber(response.data.data.phoneNumber);
          setCounty(response.data.data.county);
          setSubCounty(response.data.data.subCounty);

          checkUserProducts(userID, token);
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

  async function checkUserProducts(userID, token) {
    const url = `${process.env.ENDPOINT}/product/get-number/${userID}`;
    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    await axios
      .get(url, {
        headers,
      })
      .then((response) => {
        setLoadingData(false);
        if (response.data.data >= 2) {
          setMaxPosts(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  function validate() {
    if (!productName) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Product name is required. Please add a name then submit your product for review",
      });
    } else if (!category) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Category is required. Please add a category then submit your product for review",
      });
    } else if (!subCategory) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Category is required. Please add a subcategory then submit your product for review",
      });
    } else if (!description) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Description is required. Please add a description then submit your product for review",
      });
    } else if (!price) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Price is required. Please add a price then submit your product for review",
      });
    } else if (!condition) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Condition is required. Please add a condition then submit your product for review",
      });
    } else {
      prePostProduct();
    }
  }

  async function prePostProduct() {
    if (maxPosts == true && premiumUser == false) {
      setPaymentModal(true);
    } else {
      postProduct();
    }
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
          checkUserProducts();
          setPaymentModal(false);
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
        } else {
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
    setLoadingData(true);
    const url = `${process.env.ENDPOINT}/admin/get-categories`;

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
    setLoadingData(true);

    const url = `${process.env.ENDPOINT}/admin/get-sub-categories/${categoryID}`;

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

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        {!storedCredentials && (
          <Modal backgroundColor={colors.almostDark} width="100%" isOpen={true}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ alignSelf: "flex-end", right: 20, marginBottom: 20 }}
            >
              <Text style={{ color: colors.orange, fontWeight: "800" }}>
                Close
              </Text>
            </TouchableOpacity>
            <LoginComponent
              submitting={submitting}
              loginPress={login}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              password={password}
              setPassword={setPassword}
            />
          </Modal>
        )}

        {maxPosts == true && premiumUser == false && (
          <StaticAlert
            status="warning"
            title="Warning"
            description="You have exceeded the number of free products you can post(2). Every other product you post will be at a cost of KSH. 200 per product."
          />
        )}

        {paymentModal == true && (
          <Modal
            backgroundColor={colors.dark}
            isOpen={paymentModal}
            onClose={() => setPaymentModal(false)}
          >
            <Modal.Content width={width - 40} maxWidth={width - 40}>
              <Modal.CloseButton />
              <Modal.Header>Pay to submit product for review</Modal.Header>

              <Modal.Body>
                <Text style={{ marginBottom: 20, color: colors.dark }}>
                  In order to post this product, you will have to pay KSH. 500.
                  Ensure the number provided below is your M-Pesa number and
                  click pay. You will recive an M-Pesa prompt to input your pin
                  to complete the payment process.
                </Text>

                <Text style={postStyles.label}>Phone number</Text>
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
                    keyboardType="numeric"
                    value={phoneNumber.toString()}
                    onChangeText={setPhoneNumber}
                  />
                </View>

                <Text style={postStyles.label}>Amount</Text>
                <View style={styles.textInputContainer}>
                  <MaterialCommunityIcons
                    style={styles.searchIcon}
                    name="hand-coin-outline"
                    size={18}
                    color={colors.dark}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                    value="200"
                    editable={false}
                  />
                </View>
              </Modal.Body>

              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    width={100}
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setPaymentModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    width={100}
                    disabled={submitting}
                    onPress={postProduct}
                  >
                    {submitting == false ? (
                      "Pay"
                    ) : (
                      <BarIndicator color="white" size={20} />
                    )}
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
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

          <SecondaryButton iconName="phone-square" buttonTitle={phoneNumber} />

          <Text style={styles.label}>County</Text>

          <SecondaryButton iconName="address-book" buttonTitle={county} />

          <Text style={styles.label}>Sub county</Text>

          <SecondaryButton iconName="address-book-o" buttonTitle={subCounty} />

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={validate}
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
                {loadingData == true && (
                  <BarIndicator size={20} color="white" />
                )}
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
              <>
                {loadingData == true && (
                  <BarIndicator size={20} color="white" />
                )}

                <FlatList
                  data={subCategories}
                  renderItem={({ item }) => (
                    <PostSubCategoryList
                      key={item._id}
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
              </>
            ) : (
              <></>
            )}
          </View>
        </BottomSheet>
      </ScrollView>
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
  label: {
    fontWeight: "800",
    color: colors.dark,
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
    backgroundColor: colors.cardColor,
    width: "100%",
    height: "70%",
    paddingVertical: 40,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
  },
});

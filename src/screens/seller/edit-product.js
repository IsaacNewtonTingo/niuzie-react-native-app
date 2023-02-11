import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";

import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import * as ImagePicker from "expo-image-picker";

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
import LoginComponent from "../../componets/auth/login";
import TertiaryButton from "../../componets/buttons/tertiaryBtn";
import noImage from "../../assets/data/noImage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function EditProduct({ navigation, route }, props) {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [productName, setProductName] = useState(route.params.productName);
  const [categoryName, setCategoryName] = useState(route.params.categoryName);
  const [categoryID, setCategoryID] = useState(route.params.categoryID);
  const [subCategoryName, setSubCategoryName] = useState(
    route.params.subCategoryName
  );
  const [subCategoryID, setSubCategoryID] = useState(
    route.params.subCategoryID
  );
  const [description, setDescription] = useState(route.params.description);
  const [price, setPrice] = useState(route.params.price);
  const [condition, setCondition] = useState(route.params.condition);

  const [image1, setImage1] = useState(route.params.image1);
  const [image2, setImage2] = useState(route.params.image2);
  const [image3, setImage3] = useState(route.params.image3);
  const [image4, setImage4] = useState(route.params.image4);

  const [firstName, setFirstName] = useState(route.params.firstName);
  const [lastName, setLastName] = useState(route.params.lastName);
  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
  const [county, setCounty] = useState(route.params.county);
  const [subCounty, setSubCounty] = useState(route.params.subCounty);

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCatSheet, setShowCatSheet] = useState(false);
  const [showSubCatSheet, setShowSubCatSheet] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const userName = firstName + " " + lastName;

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;

  const productID = route.params.productID;

  useEffect(() => {
    // getUserData();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  function validate() {
    if (!productName) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Product name is required. Please add a name then submit your product for review",
      });
    } else if (!categoryID) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Category is required. Please add a category then submit your product for review",
      });
    } else if (!subCategoryID) {
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
      editProduct();
    }
  }

  async function editProduct() {
    const url = `${process.env.ENDPOINT}/product/update-product/${productID}`;
    setSubmitting(true);

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .put(
        url,
        {
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
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);
        if (response.data.status == "Success") {
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

  async function deleteProduct() {
    const url = `${process.env.ENDPOINT}/product/delete-product/${productID}?userID=${userID}`;
    setSubmitting(true);

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .delete(url, { headers })
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);
        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          navigation.popToTop();
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

  async function openImage1Picker() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!pickerResult.canceled) {
      setImage1(pickerResult.assets[0].uri);
    }
  }

  async function openImage2Picker() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!pickerResult.canceled) {
      setImage2(pickerResult.assets[0].uri);
    }
  }

  async function openImage3Picker() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!pickerResult.canceled) {
      setImage3(pickerResult.assets[0].uri);
    }
  }

  async function openImage4Picker() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!pickerResult.canceled) {
      setImage4(pickerResult.assets[0].uri);
    }
  }

  async function uploadImage1() {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image1, true);
      xhr.send(null);
    });

    let filename = image1.substring(image1.lastIndexOf("/") + 1);

    const fileRef = ref(storage, `images/${filename}`);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  async function uploadImage2() {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image2, true);
      xhr.send(null);
    });

    let filename = image2.substring(image1.lastIndexOf("/") + 1);

    const fileRef = ref(storage, `images/${filename}`);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  async function uploadImage3() {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image3, true);
      xhr.send(null);
    });

    let filename = image3.substring(image3.lastIndexOf("/") + 1);

    const fileRef = ref(storage, `images/${filename}`);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  async function uploadImage4() {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image4, true);
      xhr.send(null);
    });

    let filename = image4.substring(image4.lastIndexOf("/") + 1);

    const fileRef = ref(storage, `images/${filename}`);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
    >
      <View style={postStyles.holdingContainer}>
        <View style={styles.textComb}>
          <Text style={styles.label}>Product name</Text>
          <Text style={[styles.label, { color: "gray" }]}>
            {productName.length}/30
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
            maxLength={30}
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
          <Text style={postStyles.catText}>{categoryName}</Text>
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
          <Text style={postStyles.catText}>{subCategoryName}</Text>
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
            value={price.toString()}
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
          <ImageBackground
            style={postStyles.imageContainer}
            source={{ uri: image1 ? image1 : noImage.noProductImage }}
          >
            <TouchableOpacity onPress={openImage1Picker}>
              <FontAwesome5 name="camera" size={24} color="black" />
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            style={postStyles.imageContainer}
            source={{ uri: image2 ? image2 : noImage.noProductImage }}
          >
            <TouchableOpacity onPress={openImage2Picker}>
              <FontAwesome5 name="camera" size={24} color="black" />
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            style={postStyles.imageContainer}
            source={{ uri: image3 ? image3 : noImage.noProductImage }}
          >
            <TouchableOpacity onPress={openImage3Picker}>
              <FontAwesome5 name="camera" size={24} color="black" />
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            style={postStyles.imageContainer}
            source={{ uri: image4 ? image4 : noImage.noProductImage }}
          >
            <TouchableOpacity onPress={openImage4Picker}>
              <FontAwesome5 name="camera" size={24} color="black" />
            </TouchableOpacity>
          </ImageBackground>
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
          buttonTitle="Edit product"
        />

        <TertiaryButton
          disabled={submitting}
          submitting={submitting}
          onPress={deleteProduct}
          buttonTitle="Delete product"
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
              {loadingData == true && <BarIndicator size={20} color="white" />}
              {categories.map((category) => (
                <TouchableOpacity
                  onPress={() => {
                    setCategoryName(category.categoryName);
                    setCategoryID(category._id);

                    setSubCategoryName("");
                    setSubCategoryID("");
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
              {loadingData == true && <BarIndicator size={20} color="white" />}

              <FlatList
                data={subCategories}
                renderItem={({ item }) => (
                  <PostSubCategoryList
                    key={item._id}
                    onPress={() => {
                      setSubCategoryName(item.subCategoryName);
                      setSubCategoryID(item._id);
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
    </KeyboardAwareScrollView>
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

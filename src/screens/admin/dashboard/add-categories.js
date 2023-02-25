import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import styles from "../../../componets/styles/global-styles";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";
import { homeStyles } from "../../general/dashboard/home";
import { LinearGradient } from "expo-linear-gradient";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";
import { TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ImageBackground } from "react-native";

import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

import { CredentialsContext } from "../../../componets/context/credentials-context";
import noImage from "../../../assets/data/noImage";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export default function AddCategories({ navigation }) {
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const userID = storedCredentials.data.userID;
  const token = storedCredentials.data.token;

  useEffect(() => {
    getCategories();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-categories`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setCategories(response.data.data);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  const headers = {
    "auth-token": token,
  };
  async function addCategory() {
    if (!newCategory) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Add a category name",
      });
    } else if (!newCategoryImage) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Add a category image",
      });
    } else {
      setSubmitting(true);
      const url = `${process.env.ENDPOINT}/admin/add-category`;

      await axios
        .post(
          url,
          {
            categoryName: newCategory,
            categoryImage: newCategoryImage !== null ? await uploadImage() : "",
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);

          if (response.data.status == "Success") {
            getCategories();
            setNewCategory("");
            setNewCategoryImage(null);
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
        });
    }
  }

  async function openImagePicker() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!pickerResult.canceled) {
      setNewCategoryImage(pickerResult.assets[0].uri);
    }
  }

  async function uploadImage() {
    if (newCategoryImage == null) {
      return null;
    } else {
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
        xhr.open("GET", newCategoryImage, true);
        xhr.send(null);
      });

      let filename = newCategoryImage.substring(
        newCategoryImage.lastIndexOf("/") + 1
      );

      const fileRef = ref(storage, `images/${filename}`);
      const result = await uploadBytes(fileRef, blob);

      // We're done with the blob, close and release it
      blob.close();

      return await getDownloadURL(fileRef);
    }
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
    >
      <View style={styles.section}>
        <View style={homeStyles.miniCatContainer}>
          {categories.map((category) => (
            <LinearGradient
              key={category._id}
              start={[0.0, 0.5]}
              end={[1.0, 0.5]}
              locations={[0.0, 1.0]}
              colors={[colors.almostDark, "#001949"]}
              style={homeStyles.miniCatItem}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SubCategoriesAdmin", {
                    categoryID: category._id,
                    categoryName: category.categoryName,
                    categoryImage: category.categoryImage,
                  });
                }}
              >
                <Image
                  style={homeStyles.categoryImage}
                  source={{ uri: category.categoryImage }}
                />
                <Text style={homeStyles.categoryText}>
                  {category.categoryName}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {}]}>Add new category</Text>

        <View
          style={[
            styles.textInputContainer,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <Ionicons
            name="shirt"
            size={18}
            color={colors.gray}
            style={styles.searchIcon}
          />
          <TextInput
            value={newCategory}
            onChangeText={setNewCategory}
            style={[styles.textInput, { color: colors.dark, width: "75%" }]}
            placeholder="Enter category name here"
          />

          <ImageBackground
            style={addCatStyles.addIMGMainContainer}
            source={{
              uri:
                newCategoryImage !== null
                  ? newCategoryImage
                  : noImage.noProductImage,
            }}
          >
            <TouchableOpacity
              onPress={openImagePicker}
              style={addCatStyles.addIMGContainer}
            >
              <FontAwesome5 name="camera" size={24} color={colors.dark} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <PrimaryButton
          onPress={addCategory}
          submitting={submitting}
          disabled={submitting}
          buttonTitle="Add category"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const addCatStyles = StyleSheet.create({
  addIMGMainContainer: {
    width: width / 5,
    height: 50,
    backgroundColor: colors.cardColor,
    borderRadius: 10,
  },
  addIMGContainer: {
    width: width / 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheet } from "react-native-btr";
import { Modal } from "native-base";

import { Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import SubCategoryList from "../../../componets/lists/sub-category-list";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import { FloatingAction } from "react-native-floating-action";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import { showMyToast } from "../../../functions/show-toast";
import { ImageBackground } from "react-native";

import TertiaryButton from "../../../componets/buttons/tertiaryBtn";
import NoData from "../../../componets/Text/no-data";

const { width } = Dimensions.get("window");

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

export default function SubCategoriesAdmin({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;

  const [subCategories, setSubCategories] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [subCategory, setSubCategory] = useState("");
  const [addSubCatModal, setAddSubCatModal] = useState(false);

  const categoryImage = route.params.categoryImage;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryName, setcategoryName] = useState(route.params.categoryName);
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  const [editCategoryModal, setEditCategoryModal] = useState(false);

  const [clickedName, setClickedName] = useState("");
  const [clickedID, setClickedID] = useState("");

  const categoryID = route.params.categoryID;

  const EditIcon = () => {
    return <AntDesign name="edit" size={24} color={colors.lightBlue} />;
  };

  const AddIcon = () => {
    return <AntDesign name="addfolder" size={24} color={colors.lightBlue} />;
  };

  const actions = [
    {
      text: "Add new subcategory",
      icon: <AddIcon />,
      name: "add",
      position: 1,
    },

    {
      text: "Edit this category",
      icon: <EditIcon />,
      name: "edit",
      position: 3,
    },
  ];

  useEffect(() => {
    getSubCategories();
  }, []);

  const headers = {
    "auth-token": token,
  };

  async function getSubCategories() {
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

  async function addSubCategory() {
    const url = `${process.env.ENDPOINT}/admin/add-sub-category/${categoryID}`;
    setSubmitting(true);
    await axios
      .post(url, { userID, subCategoryName: subCategory }, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          getSubCategories();
          setSubCategory("");
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

  async function updateSubCategory() {
    const url = `${process.env.ENDPOINT}/admin/update-sub-category/${clickedID}`;
    setSubmitting(true);
    await axios
      .put(url, { userID, subCategoryName: clickedName }, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          getSubCategories();
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

  async function deleteSubCategory() {
    const url = `${process.env.ENDPOINT}/admin/delete-sub-category/${clickedID}?userID=${userID}`;
    setSubmitting(true);
    await axios
      .delete(url, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          getSubCategories();
          setShowDeleteModal(false);
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

  async function editCategory() {
    const url = `${process.env.ENDPOINT}/admin/edit-category/${categoryID}`;
    setSubmitting(true);
    await axios
      .put(
        url,
        {
          categoryName,
          categoryImage:
            newCategoryImage !== null ? await uploadImage() : categoryName,
        },
        { headers }
      )
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          setEditCategoryModal(false);
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

  async function deleteCategory() {
    const url = `${process.env.ENDPOINT}/admin/delete-category/${categoryID}`;
    setSubmitting(true);
    await axios
      .delete(url, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          setEditCategoryModal(false);
          navigation.goBack();
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

  function handleActionPressed(name) {
    if (name == "add") {
      setAddSubCatModal(true);
    } else {
      setEditCategoryModal(true);
    }
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {subCategories.length < 1 && (
        <NoData text="No subcategories in this category" />
      )}
      <FlatList
        data={subCategories}
        renderItem={({ item }) => (
          <SubCategoryList
            subCategoryID={item._id}
            subCategoryName={item.subCategoryName}
            onPress={() => {
              setShowDeleteModal(true);
              setClickedName(item.subCategoryName);
              setClickedID(item._id);
            }}
          />
        )}
      />

      <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          handleActionPressed(name);
        }}
      />

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <View style={subStyles.mod}>
          <Modal.CloseButton />

          {/* <Text>Do you want to delete the subcategory "{tobeDeleted}" ?</Text> */}

          <Text style={[styles.label, { color: colors.dark }]}>
            Edit sub category name
          </Text>
          <View style={styles.textInputContainer}>
            <Ionicons
              name="shirt"
              size={18}
              color={colors.gray}
              style={styles.searchIcon}
            />
            <TextInput
              value={clickedName}
              onChangeText={setClickedName}
              style={[styles.textInput, { color: colors.dark, width: "100%" }]}
              placeholder="e.g Sneakers"
            />
          </View>

          <PrimaryButton
            buttonTitle="Update"
            disabled={submitting}
            submitting={submitting}
            onPress={updateSubCategory}
            style={{ borderColor: colors.lightBlue }}
          />

          <TertiaryButton
            buttonTitle="Delete"
            disabled={submitting}
            submitting={submitting}
            onPress={deleteSubCategory}
            labelStyles={{ color: colors.dark }}
          />
        </View>
      </Modal>

      <BottomSheet
        visible={addSubCatModal}
        onBackButtonPress={() => setAddSubCatModal(false)}
        onBackdropPress={() => setAddSubCatModal(false)}
      >
        <View style={subStyles.btmSheet}>
          <Text style={styles.label}>Sub category name</Text>

          <View style={styles.textInputContainer}>
            <Ionicons
              name="shirt"
              size={18}
              color={colors.gray}
              style={styles.searchIcon}
            />
            <TextInput
              value={subCategory}
              onChangeText={setSubCategory}
              style={[styles.textInput, { color: colors.dark, width: "100%" }]}
              placeholder="e.g Sneakers"
            />
          </View>

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={addSubCategory}
            buttonTitle="Add"
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={editCategoryModal}
        onBackButtonPress={() => setEditCategoryModal(false)}
        onBackdropPress={() => setEditCategoryModal(false)}
      >
        <View style={subStyles.btmSheet}>
          <Text style={styles.label}>New category name</Text>

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
              value={categoryName}
              onChangeText={setcategoryName}
              style={[styles.textInput, { color: colors.dark, width: "75%" }]}
              placeholder="Enter category name here"
            />

            <ImageBackground
              style={subStyles.addIMGMainContainer}
              source={{
                uri:
                  newCategoryImage !== null ? newCategoryImage : categoryImage,
              }}
            >
              <TouchableOpacity
                onPress={openImagePicker}
                style={subStyles.addIMGContainer}
              >
                <FontAwesome5 name="camera" size={24} color={colors.dark} />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={editCategory}
            buttonTitle="Add"
          />

          <TertiaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={deleteCategory}
            buttonTitle="Delete category"
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const subStyles = StyleSheet.create({
  btmSheet: {
    padding: 20,
    backgroundColor: colors.cardColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  mod: {
    backgroundColor: colors.lightBlue,
    padding: 20,
    width: width - 40,
    borderRadius: 10,
  },
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

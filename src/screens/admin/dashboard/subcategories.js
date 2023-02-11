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

import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import SubCategoryList from "../../../componets/lists/sub-category-list";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import { Ionicons, FontAwesome } from "@expo/vector-icons";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import { showMyToast } from "../../../functions/show-toast";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";
import NoData from "../../../componets/Text/no-data";

const { width } = Dimensions.get("window");

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [clickedName, setClickedName] = useState("");
  const [clickedID, setClickedID] = useState("");

  const categoryID = route.params.categoryID;

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

      <TouchableOpacity
        onPress={() => setAddSubCatModal(true)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      >
        <Ionicons name="add-circle-sharp" size={50} color={colors.lightBlue} />
      </TouchableOpacity>

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
});

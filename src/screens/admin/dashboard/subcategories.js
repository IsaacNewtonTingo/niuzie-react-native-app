import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheet } from "react-native-btr";

import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import SubCategoryList from "../../../componets/lists/sub-category-list";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import { Ionicons, FontAwesome } from "@expo/vector-icons";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import { showMyToast } from "../../../functions/show-toast";

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
      <FlatList
        data={subCategories}
        renderItem={({ item }) => (
          <SubCategoryList
            subCategoryID={item._id}
            subCategoryName={item.subCategoryName}
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
              keyboardType="numeric"
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
});

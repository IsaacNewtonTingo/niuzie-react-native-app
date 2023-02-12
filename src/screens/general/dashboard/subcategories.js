import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import axios from "axios";

import styles from "../../../componets/styles/global-styles";
import SubCategoryList from "../../../componets/lists/sub-category-list";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import colors from "../../../componets/colors/colors";

import { CredentialsContext } from "../../../componets/context/credentials-context";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { showMyToast } from "../../../functions/show-toast";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

const B = (props) => (
  <Text style={{ color: colors.gray, fontWeight: "400" }}>
    {props.children}
  </Text>
);

export default function Subcategories({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = data?.userID;
  const token = data?.token;

  const [subCategories, setSubCategories] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [subscribed, setSubscribed] = useState(false);

  const categoryID = route.params.categoryID;

  useEffect(() => {
    getSubCategories();
    checkIfSubd();
  }, []);

  const headers = {
    "auth-token": token,
  };

  async function getSubCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-sub-categories/${categoryID}`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setSubCategories(response.data.data);
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

  //check if subd
  async function checkIfSubd() {
    const url = `${process.env.ENDPOINT}/category/check-subscriber/${categoryID}`;

    await axios
      .post(url, { userID })
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Success") {
          if (response.data.data == true) {
            setSubscribed(true);
          } else {
            setSubscribed(false);
          }
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

  async function subToCategory() {
    const url = `${process.env.ENDPOINT}/category/subscribe/${categoryID}`;
    setSubmitting(true);

    await axios
      .post(url, { userID }, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Success") {
          setSubscribed(response.data.data);
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

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={subToCategory} style={subCatStyles.subCont}>
        <MaterialCommunityIcons
          name="youtube-subscription"
          size={40}
          color={colors.gray}
        />

        {subscribed == false ? (
          <Text
            style={[
              subCatStyles.subText,
              { opacity: submitting == true ? 0.2 : 1 },
            ]}
          >
            Subscribe to this category{" "}
            <B>
              to get notifications each time a product is added. You can
              unsubscribe any time you want.
            </B>
          </Text>
        ) : (
          <Text style={subCatStyles.subText}>
            Unsubscribe from this category.{" "}
            <B>You can subscribe any time you want.</B>
          </Text>
        )}

        {submitting == true ? (
          <ActivityIndicator color={colors.lightBlue} size="small" />
        ) : (
          <></>
        )}
      </TouchableOpacity>

      <FlatList
        data={subCategories}
        renderItem={({ item }) => (
          <SubCategoryList
            onPress={() => {
              navigation.navigate("SubcategoryProducts", {
                item,
                subCategoryName: item.subCategoryName,
              });
            }}
            subCategoryID={item._id}
            subCategoryName={item.subCategoryName}
          />
        )}
      />
    </View>
  );
}

const subCatStyles = StyleSheet.create({
  subCont: {
    flexDirection: "row",
    alignItems: "center",
    width: width,
    padding: 20,
    alignSelf: "center",
  },
  subText: {
    color: colors.linkText,
    fontWeight: "800",
    marginLeft: 10,
    flex: 1,
  },
});

import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../../../componets/styles/global-styles";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import ProductRequest from "../../../componets/cards/product-request.js";
import MyRequests from "../../../componets/cards/my-requests";

export default function MyProductRequests({ route }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    getMyProductRequests();
  }, [route]);

  const headers = {
    "auth-token": token,
  };

  async function getMyProductRequests() {
    const url = `${process.env.ENDPOINT}/buyer-needs/get-user-needs/${userID}`;
    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        } else {
          setRequestList(response.data.data);
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={requestList}
        renderItem={({ item }) => <MyRequests onPress={() => {}} item={item} />}
      />
    </View>
  );
}

const prodRequestStyles = StyleSheet.create({});

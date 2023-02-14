import { StyleSheet, Text, Dimensions, View } from "react-native";
import React from "react";
import styles from "../../../componets/styles/global-styles";
import { FlatList } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import ProductRequest from "../../../componets/cards/product-request.js";
import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import { showMyToast } from "../../../functions/show-toast";

const { width } = Dimensions.get("window");

export default function AllProductRequests({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [productRequests, setProductRequests] = useState([]);

  useEffect(() => {
    getProductRequests();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getProductRequests() {
    const url = `${process.env.ENDPOINT}/buyer-needs/get-all-needs`;
    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setProductRequests(response.data.data);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
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
    <View style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={productRequests}
        renderItem={({ item }) => (
          <ProductRequest
            onPress={() =>
              navigation.navigate("ProductRequestDetails", { item })
            }
            item={item}
            style={{
              width: width - 40,
              marginRight: 0,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
        )}
      />
    </View>
  );
}

const featStyles = StyleSheet.create({});

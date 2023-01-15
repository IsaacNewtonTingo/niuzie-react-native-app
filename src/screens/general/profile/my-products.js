import { ScrollView, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { CredentialsContext } from "../../../componets/context/credentials-context";

import styles from "../../../componets/styles/global-styles";
import HorizontalCard from "../../../componets/cards/horizontal-card";

import { ENDPOINT } from "@env";
import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

export default function MyProducts({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";

  useEffect(() => {
    getUserProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getUserProducts() {
    const url = `${ENDPOINT}/product/get-user-products/${userID}?productID=`;
    await axios
      .get(url)
      .then((response) => {
        setProducts(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function handleProductPressed(item) {
    navigation.push("ProductDetails", { item });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <HorizontalCard
            onPress={() => handleProductPressed(item)}
            style={{ marginBottom: 10 }}
            key={item._id}
            productImage1={item.image1}
            productImage2={item.image2}
            productImage3={item.image3}
            productImage4={item.image4}
            productName={item.productName}
            price={item.price}
            condition={item.condition}
            description={item.description}
            county={item.user.county}
            subCounty={item.user.subCounty}
            rating={item.rating.$numberDecimal}
          />
        )}
      />
    </View>
  );
}

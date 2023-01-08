import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import HorizontalCard from "../../../componets/cards/horizontal-card";
import styles from "../../../componets/styles/global-styles";

import { ENDPOINT } from "@env";
import axios from "axios";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

export default function Discover() {
  const [allProducts, setAllProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getAllProducts();
  }, []);

  async function getAllProducts() {
    const url = `${ENDPOINT}/product/get-all-products`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        setAllProducts(response.data);
        console.log(response.data[0]);
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
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        numColumns={2}
        data={allProducts}
        renderItem={({ item }) => (
          <HorizontalCard
            style={{ marginBottom: 10 }}
            key={item.productName}
            productImage={item.image1}
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

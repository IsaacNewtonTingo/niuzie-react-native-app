import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import HorizontalCard from "../../../componets/cards/horizontal-card";
import styles from "../../../componets/styles/global-styles";

const allProducts = require("../../../assets/data/top-products.json");

export default function Discover() {
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
            rating={item.rating}
          />
        )}
      />
    </View>
  );
}

import { StyleSheet, ScrollView, Text, View } from "react-native";
import React from "react";
import styles from "../../componets/styles/global-styles";
import HorizontalCard from "../../componets/cards/horizontal-card";

export default function PayForProduct({ route, navigation }) {
  const image1 = route.params.image1;
  const productName = route.params.productName;
  const condition = route.params.condition;
  const description = route.params.description;
  const county = route.params.county;
  const subCounty = route.params.subCounty;
  const price = route.params.price;

  return (
    <ScrollView style={styles.container}>
      <HorizontalCard
        productImage1={image1}
        productName={productName}
        price={price}
        condition={condition}
        description={description}
        county={county}
        subCounty={subCounty}
      />
    </ScrollView>
  );
}

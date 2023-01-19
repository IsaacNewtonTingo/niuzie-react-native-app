import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

import HorizontalCard from "../../../componets/cards/horizontal-card";
import styles from "../../../componets/styles/global-styles";

import { ENDPOINT } from "@env";
import axios from "axios";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import { FontAwesome5 } from "@expo/vector-icons";

import { BottomSheet } from "react-native-btr";
import colors from "../../../componets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../../../componets/buttons/primary-button";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

export default function Discover({ navigation }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterModal, setFilterModal] = useState(true);

  useEffect(() => {
    getAllProducts();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getAllProducts() {
    const url = `${ENDPOINT}/product/get-all-products?county=&subCounty=&category=&subCategory=&searchTerm=&condition=`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        setAllProducts(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function handleProductPressed(item) {
    navigation.navigate("ProductDetails", { item });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome5
          style={styles.searchIcon}
          name="search"
          size={18}
          color="black"
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a product"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        style={styles.flatlist}
        // numColumns={2}
        data={allProducts}
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

      <BottomSheet
        visible={filterModal}
        onBackButtonPress={() => setFilterModal(false)}
        onBackdropPress={() => setFilterModal(false)}
      >
        <LinearGradient
          colors={[colors.gray, colors.dark]}
          style={discoverStyles.bottomNavigationView}
          // start={[0.0, 0.5]}
          // end={[1.0, 0.5]}
          locations={[0.0, 1.0]}
        >
          <Text style={styles.label}>Category</Text>

          <TextInput
            // value={firstName}
            // onChangeText={setFirstName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g John"
          />

          <Text style={styles.label}>Sub category</Text>

          <TextInput
            // value={firstName}
            // onChangeText={setFirstName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g John"
          />

          <Text style={styles.label}>County</Text>

          <TextInput
            // value={firstName}
            // onChangeText={setFirstName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g John"
          />

          <Text style={styles.label}>Sub county</Text>

          <TextInput
            // value={firstName}
            // onChangeText={setFirstName}
            style={[styles.textInput, { color: colors.dark }]}
            placeholder="e.g John"
          />

          <PrimaryButton buttonTitle="Submit" />

          <TertiaryButton buttonTitle="Cancel" />
        </LinearGradient>
      </BottomSheet>
    </View>
  );
}

const discoverStyles = StyleSheet.create({
  bottomNavigationView: {
    height: "90%",
    backgroundColor: colors.cardColor,
    width: "100%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    padding: 40,
  },
});

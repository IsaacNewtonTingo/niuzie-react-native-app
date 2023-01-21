import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

import HorizontalCard from "../../../componets/cards/horizontal-card";
import styles from "../../../componets/styles/global-styles";

import { ENDPOINT } from "@env";
import axios from "axios";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import {
  Input,
  Icon,
  Stack,
  Pressable,
  Center,
  NativeBaseProvider,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { BottomSheet } from "react-native-btr";
import colors from "../../../componets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../../../componets/buttons/primary-button";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Discover({ navigation }) {
  let [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCatCategory] = useState("");
  const [condition, setCondition] = useState("");

  const [filterModal, setFilterModal] = useState(true);

  const [show, setShow] = React.useState(false);

  useEffect(() => {
    getAllProducts();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getAllProducts() {
    let url = `${ENDPOINT}/product/get-all-products?county=${county}&subCounty=${subCounty}&category=${category}&subCategory=${subCategory}&searchTerm=${searchTerm}&condition=${condition}`;
    setLoadingData(true);

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
      <Input
        w={{
          base: "100%",
          md: "25%",
        }}
        type="text"
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="search" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        InputRightElement={
          <TouchableOpacity onPress={() => getAllProducts()}>
            <Icon
              as={<AntDesign name="arrowright" />}
              size={5}
              mr="2"
              color="muted.400"
            />
          </TouchableOpacity>
        }
        placeholder="Search product"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ color: colors.lightBlue }}
      />

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
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 40,
  },
});

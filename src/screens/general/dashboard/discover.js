import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { BottomSheet } from "react-native-btr";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import { postStyles } from "../../seller/post-product";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

const { width } = Dimensions.get("window");

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

  const [price, setPrice] = useState("1");
  const [rating, setRating] = useState("1");
  const [date, setDate] = useState("1");

  const [filterModal, setFilterModal] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getAllProducts() {
    let url = `${ENDPOINT}/product/get-all-products?county=${county}&subCounty=${subCounty}&category=${category}&subCategory=${subCategory}&searchTerm=${searchTerm}&condition=${condition}&price=${price}&rating=${rating}&date=${date}`;
    setLoadingData(true);
    setSubmitting(true);

    await axios
      .get(url)
      .then((response) => {
        setSubmitting(false);
        setLoadingData(false);
        // setFilterModal(false);
        setAllProducts(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        setLoadingData(false);
      });
  }

  async function handleProductPressed(item) {
    navigation.navigate("ProductDetails", { item });
  }

  // if (loadingData) {
  //   return <LoadingIndicator />;
  // }

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
    >
      <View style={discoverStyles.searcContainer}>
        <Input
          w={{
            base: width - 80,
            // md: "25%",
          }}
          h={{
            base: 50,
          }}
          borderRadius={10}
          borderColor={colors.gray}
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
          style={{ color: colors.lightBlue, borderRadius: 10 }}
        />

        <TouchableOpacity
          onPress={() => setFilterModal(!filterModal)}
          style={discoverStyles.filterContainer}
        >
          <MaterialCommunityIcons
            name="filter-menu-outline"
            size={24}
            color={colors.lightBlue}
          />
        </TouchableOpacity>
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
          colors={[colors.almostDark, colors.dark]}
          style={discoverStyles.bottomNavigationView}
          // start={[0.0, 0.5]}
          // end={[1.0, 0.5]}
          locations={[0.0, 1.0]}
        >
          <View style={discoverStyles.topOpts}>
            <Text style={{ color: colors.linkText, fontWeight: "800" }}>
              Reset
            </Text>

            <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
              Filter
            </Text>

            <AntDesign
              onPress={() => setFilterModal(false)}
              name="close"
              size={18}
              color={colors.lightBlue}
            />
          </View>

          <PrimaryButton
            buttonTitle="Filter"
            style={{ position: "absolute", bottom: 20 }}
          />
        </LinearGradient>
      </BottomSheet>
    </SafeAreaView>
  );
}

const discoverStyles = StyleSheet.create({
  bottomNavigationView: {
    height: "90%",
    backgroundColor: colors.cardColor,
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  searcContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    width: width,
  },
  filterContainer: {
    backgroundColor: colors.cardColor,
    padding: 10,
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  radios: {
    width: "100%",
    backgroundColor: colors.inputBG,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0066FF",
    padding: 10,
  },

  radioText: {
    color: colors.dark,
    fontWeight: "800",
  },
  label: {
    color: colors.linkText,
    fontWeight: "800",
    marginVertical: 10,
  },
  topOpts: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

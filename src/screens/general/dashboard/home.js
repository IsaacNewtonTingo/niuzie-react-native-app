import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

import colors from "../../../componets/colors/colors";
import styles from "../../../componets/styles/global-styles";

import VerticalProductCard from "../../../componets/cards/vertical-product";

import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import ProductRequest from "../../../componets/cards/product-request.js";

import { LinearGradient } from "expo-linear-gradient";
import { Icon, Input } from "native-base";

import * as SecureStore from "expo-secure-store";

import axios from "axios";
import HorizontalCard from "../../../componets/cards/horizontal-card";
const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [productRequests, setProductRequests] = useState([]);

  const [premiumProducts, setPremiumProducts] = useState([]);

  useEffect(() => {
    getCategories();
    getPremiumProducts();
    getProductRequests();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-categories`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setCategories(response.data.data);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function getProductRequests() {
    const url = `${process.env.ENDPOINT}/buyer-needs/get-all-needs`;
    await axios
      .get(url)
      .then((response) => {
        if (response.data.status == "Success") {
          setProductRequests(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getPremiumProducts() {
    const url = `${process.env.ENDPOINT}/product/get-premium-user-products`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setPremiumProducts(response.data.data);
        } else {
          console.log(response.data.message);
        }
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
    <ScrollView style={styles.container}>
      {productRequests.length > 0 && (
        <View style={styles.section}>
          <View style={[styles.textComb, { marginBottom: 20 }]}>
            <Text style={styles.subText}>Buyer requests</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>

          <View style={homeStyles.miniCatContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={productRequests}
              renderItem={({ item }) => (
                <ProductRequest
                  onPress={() =>
                    navigation.navigate("ProductRequestDetails", { item })
                  }
                  item={item}
                />
              )}
            />
          </View>
        </View>
      )}

      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subText, { marginBottom: 20 }]}>Categories</Text>

          <View style={homeStyles.miniCatContainer}>
            {categories.map((category) => (
              <LinearGradient
                key={category._id}
                start={[0.0, 0.5]}
                end={[1.0, 0.5]}
                locations={[0.0, 1.0]}
                colors={[colors.almostDark, "#001949"]}
                style={homeStyles.miniCatItem}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Subcategories", {
                      categoryID: category._id,
                      categoryName: category.categoryName,
                    });
                  }}
                >
                  <Image
                    style={homeStyles.categoryImage}
                    source={{ uri: category.categoryImage }}
                  />
                  <Text style={homeStyles.categoryText}>
                    {category.categoryName}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        </View>
      )}

      {premiumProducts.length > 0 && (
        <View style={styles.section}>
          <View style={[styles.textComb, { marginBottom: 20 }]}>
            <Text style={styles.subText}>Featured products</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>

          <View style={homeStyles.miniCatContainer}>
            {premiumProducts.map((item) => (
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
                premium={item.user.premium}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export const homeStyles = StyleSheet.create({
  imageCarousel: {
    width: width,
    height: width / 1.8,
    borderRadius: 10,
  },

  carouselContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  miniCatItem: {
    width: width / 4.5,
    height: width / 4.5,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  miniCatContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  categoryText: {
    color: colors.lightBlue,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 10,
  },
});

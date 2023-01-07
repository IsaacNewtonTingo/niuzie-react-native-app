import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  LayoutAnimation,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import colors from "../../../componets/colors/colors";
import styles from "../../../componets/styles/global-styles";

import VerticalProductCard from "../../../componets/cards/vertical-product";
import HorizontalCard from "../../../componets/cards/horizontal-card";

import { FontAwesome5 } from "@expo/vector-icons";

import { ENDPOINT } from "@env";
import LoadingSkeleton from "../../../componets/preloader/skeleton";

const { width } = Dimensions.get("window");

const topProductsData = require("../../../assets/data/top-products.json");
const recentViewsData = require("../../../assets/data/top-products.json");

export default function Home() {
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();

    return () => {
      getCategories();
    };
  }, []);

  async function getCategories() {
    const url = `${ENDPOINT}/admin/get-categories`;

    await axios
      .get(url)
      .then((response) => {
        setCategories(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  if (loadingData) {
    return <LoadingSkeleton />;
  }

  return (
    <ScrollView style={styles.container}>
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

      <View style={homeStyles.carouselContainer}>
        <Image
          style={homeStyles.imageCarousel}
          source={require("../../../assets/images/promo.jpg")}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subText}>Categories</Text>

        <View style={homeStyles.miniCatContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              style={homeStyles.miniCatItem}
              key={category.categoryName}
            >
              <Image
                style={homeStyles.categoryImage}
                source={{ uri: category.categoryImage }}
              />
              <Text style={homeStyles.categoryText}>
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.textComb}>
          <Text style={styles.subText}>Top products</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        <View style={homeStyles.miniCatContainer}>
          {topProductsData.map((product) => (
            <VerticalProductCard
              key={product.productName}
              productImage={product.image1}
              productName={product.productName}
              price={product.price}
              condition={product.condition}
              description={product.description}
              county={product.user.county}
              subCounty={product.user.subCounty}
              rating={product.rating}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subText}>Recently viewed</Text>
        <View style={homeStyles.miniCatContainer}>
          <FlatList
            scrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentViewsData}
            renderItem={({ item }) => (
              <HorizontalCard
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
      </View>
    </ScrollView>
  );
}

const homeStyles = StyleSheet.create({
  imageCarousel: {
    width: width,
    height: width / 1.8,
    borderRadius: 10,
  },

  carouselContainer: {
    marginTop: 20,
  },
  miniCatItem: {
    width: width / 4.5,
    height: width / 4.5,
    backgroundColor: colors.cardColor,
    marginRight: 10,
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
    width: 30,
    height: 30,
  },
  categoryText: {
    color: colors.lightBlue,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 10,
  },
});

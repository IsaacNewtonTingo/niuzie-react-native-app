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
import React, { useState, useRef } from "react";

import colors from "../../../componets/colors/colors";
import styles from "../../../componets/styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import VerticalProductCard from "../../../componets/cards/vertical-product";

const { width } = Dimensions.get("window");

const categoriesData = require("../../../assets/data/categories.json");
const topProductsData = require("../../../assets/data/top-products.json");

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

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
          {categoriesData.map((category) => (
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

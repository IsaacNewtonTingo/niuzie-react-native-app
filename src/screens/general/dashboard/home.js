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
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import ProductRequest from "../../../componets/cards/product-request.js";

import { LinearGradient } from "expo-linear-gradient";
import { Icon, Input } from "native-base";
import { discoverStyles } from "./discover";

const { width } = Dimensions.get("window");

const topProductsData = [];
const recentViewsData = [];

export default function Home({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  const productRequests = [
    {
      firstName: "Henry",
      lastName: "Ford",
      profilePicture: "",
      content:
        "Hello. Is there anyone selling Samsung Galaxy S22 that is slightly used? I need it at an affordable price",
      county: "Nairobi",
      subCounty: "Kasarani",
      date: "17th Jan 2023",
    },

    {
      firstName: "Natalie",
      lastName: "Churning",
      profilePicture: "",
      content:
        "Someone selling a brand new Ford GT 500 Mustang the 1969 model please reach out to me. I have a lot of money ",
      county: "Siaya",
      subCounty: "Bondo",
      date: "11th Jan 2023",
    },
  ];

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-categories`;

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
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={discoverStyles.searchContainer}>
        <Input
          w={{
            base: "100%",
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
            <TouchableOpacity>
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
      </View>

      <View style={styles.section}>
        <View style={styles.textComb}>
          <Text style={styles.subText}>Buyer requests</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        <View style={homeStyles.miniCatContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={productRequests}
            renderItem={({ item }) => <ProductRequest item={item} />}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subText}>Categories</Text>

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

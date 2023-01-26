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
const { width } = Dimensions.get("window");

const topProductsData = [];

export default function Home({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [productRequests, setProductRequests] = useState([]);

  const [token, setToken] = useState("");

  useEffect(() => {
    getStoredData();
    getProductRequests();
  }, []);

  const getStoredData = async () => {
    await SecureStore.getItemAsync("loginCredentials")
      .then((result) => {
        if (result !== null) {
          const jsonData = JSON.parse(result);
          setToken(jsonData.data.token);
          getCategories(jsonData.data.token);
        } else {
          setToken("");
        }
      })
      .catch((error) => console.log(error));
  };

  async function getCategories(token) {
    const url = `${process.env.ENDPOINT}/admin/get-categories`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers: headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setCategories(response.data.data);
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

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.searchContainer}>
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
      </View> */}

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

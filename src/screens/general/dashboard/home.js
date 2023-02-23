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
import React, { useState, useEffect, useContext } from "react";

import colors from "../../../componets/colors/colors";
import styles from "../../../componets/styles/global-styles";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import ProductRequest from "../../../componets/cards/product-request.js";

import { LinearGradient } from "expo-linear-gradient";

import axios from "axios";
import HorizontalCard from "../../../componets/cards/horizontal-card";

import {
  CredentialsContext,
  NotificationContext,
} from "../../../componets/context/credentials-context";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { notifications, setNotifications } = useContext(NotificationContext);

  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [productRequests, setProductRequests] = useState([]);

  const [premiumProducts, setPremiumProducts] = useState([]);

  useEffect(() => {
    getCategories();
    getPremiumProducts();
    getProductRequests();

    checkUserData();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  function checkUserData() {
    const { data } = storedCredentials ? storedCredentials : "";

    if (data) {
      setUserID(data.userID);
      setToken(data.token);

      getNotifications(data.userID, data.token);
    }
  }

  async function getNotifications(userID, token) {
    const url = `${process.env.ENDPOINT}/user/get-notifications/${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.status == "Success") {
          setNotifications(response.data.data.unread);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

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
    navigation.navigate("ProductDetails", {
      productID: item._id,
      productOwnerID: item.user._id,
    });
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
            <TouchableOpacity
              onPress={() => navigation.navigate("AllProductRequests")}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
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

            <TouchableOpacity
              onPress={() => navigation.navigate("AllFeaturedProducts")}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
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
                rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
                premium={item.user.premium}
                promoted={item.promoted}
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

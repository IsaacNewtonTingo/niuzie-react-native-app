import { StyleSheet, Text, Dimensions, View } from "react-native";
import React from "react";
import styles from "../../../componets/styles/global-styles";
import { FlatList } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import ProductRequest from "../../../componets/cards/product-request.js";
import axios from "axios";
import HorizontalCard from "../../../componets/cards/horizontal-card";
import { showMyToast } from "../../../functions/show-toast";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

const { width } = Dimensions.get("window");

export default function AllFeaturedProducts({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [premiumProducts, setPremiumProducts] = useState([]);

  useEffect(() => {
    getPremiumProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getPremiumProducts() {
    const url = `${process.env.ENDPOINT}/product/get-premium-user-products`;
    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setPremiumProducts(response.data.data);
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
    <View style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={premiumProducts}
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
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
            premium={item.user.premium}
            promoted={item.promoted}
          />
        )}
      />
    </View>
  );
}

const featStyles = StyleSheet.create({});

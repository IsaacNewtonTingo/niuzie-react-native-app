import { ScrollView, StyleSheet, Text, FlatList, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";

import styles from "../../../componets/styles/global-styles";
import HorizontalCard from "../../../componets/cards/horizontal-card";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import axios from "axios";
import NoData from "../../../componets/Text/no-data";

export default function SavedProducts({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;

  const userID = data.userID;
  const token = data.token;

  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    getSavedItems();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getSavedItems() {
    const url = `${process.env.ENDPOINT}/product/get-saved-products/${userID}`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setSavedItems(response.data.data);
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {savedItems.length < 1 && <NoData text="No saved items" />}
      <FlatList
        data={savedItems}
        renderItem={({ item }) => (
          <HorizontalCard
            key={item._id}
            productImage1={item.product.image1}
            productImage2={item.product.image2}
            productImage3={item.product.image3}
            productImage4={item.product.image4}
            productName={item.product.productName}
            price={item.product.price}
            condition={item.product.condition}
            description={item.product.description}
            county={item.product.user.county}
            subCounty={item.product.user.subCounty}
            rating={parseFloat(item.product.rating.$numberDecimal).toFixed(1)}
            premium={item.product.user.premium}
          />
        )}
      />
    </View>
  );
}

const savedStyles = StyleSheet.create({});

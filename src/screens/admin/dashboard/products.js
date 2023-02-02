import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import styles from "../../../componets/styles/global-styles";
import colors from "../../../componets/colors/colors";
import MoneyCard from "../../../componets/cards/money-card";

import { Divider, Flex } from "native-base";

const { width } = Dimensions.get("window");

import { CredentialsContext } from "../../../componets/context/credentials-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import HorizontalCard from "../../../componets/cards/horizontal-card";
import axios from "axios";
import NoData from "../../../componets/Text/no-data";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

export default function Products({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [newProducts, setNewProducts] = useState([]);
  const [approvedProductsList, setApprovedProductsList] = useState([]);
  const [rejectedProductsList, setRejectedProductsList] = useState([]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "New", title: "New products" },
    { key: "Approved", title: "Approved" },
    { key: "Rejected", title: "Rejected" },
  ]);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const token = storedCredentials ? data.token : "";

  useEffect(() => {
    getProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getProducts() {
    const url = `${process.env.ENDPOINT}/admin/get-products`;
    setLoadingData(true);
    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Success") {
          const products = response.data.data;

          const newProducts = products.filter(function (product) {
            if (product.reviewed == false) {
              return true;
            }
          });
          setNewProducts(newProducts);

          const approvedProducts = products.filter(function (product) {
            if (product.reviewed == true && product.verified == true) {
              return true;
            }
          });
          setApprovedProductsList(approvedProducts);

          const rejectedProducts = products.filter(function (product) {
            if (product.reviewed == true && product.verified == false) {
              return true;
            }
          });
          setRejectedProductsList(rejectedProducts);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function handleProductPressed(item) {
    navigation.push("AdminProductDetails", { item });
  }

  const newlyAddedProducts = () => (
    <>
      {newProducts.length < 1 && <NoData text="No data" />}
      <FlatList
        data={newProducts}
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
    </>
  );

  const approvedProducts = () => (
    <>
      {approvedProductsList.length < 1 && <NoData text="No data" />}

      <FlatList
        data={approvedProductsList}
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
    </>
  );

  const rejectedProducts = () => (
    <>
      {rejectedProductsList.length < 1 && <NoData text="No data" />}

      <FlatList
        data={rejectedProductsList}
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
    </>
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            color: focused ? colors.lightBlue : colors.gray,
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: colors.bar }}
    />
  );

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <TabView
        renderTabBar={renderTabBar}
        style={styles.container}
        navigationState={{ index: index, routes: routes }}
        renderScene={SceneMap({
          New: newlyAddedProducts,
          Approved: approvedProducts,
          Rejected: rejectedProducts,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
      />
    </View>
  );
}

const adminDashStyles = StyleSheet.create({
  moneyCard: {
    width: width - 40,
    alignSelf: "center",
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    opacity: 0.2,
  },
  subText: {
    color: colors.gray,
  },
  bigText: {
    fontSize: 40,
    color: colors.lightBlue,
    fontWeight: "900",
    marginVertical: 10,
  },
});

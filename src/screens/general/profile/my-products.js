import { FlatList, Dimensions, Text } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { CredentialsContext } from "../../../componets/context/credentials-context";

import styles from "../../../componets/styles/global-styles";
import HorizontalCard from "../../../componets/cards/horizontal-card";

import { ENDPOINT } from "@env";
import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import colors from "../../../componets/colors/colors";
import NoData from "../../../componets/Text/no-data";

export default function MyProducts({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState([]);

  const [activeProductsList, setActiveProductsList] = useState([]);
  const [underReviewProductsList, setUnderReviewProductsList] = useState([]);
  const [inactiveProductsList, setInactiveProductsList] = useState([]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Active", title: "Active" },
    { key: "UnderReview", title: "Under review" },
    { key: "Inactive", title: "Inactive" },
  ]);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";

  useEffect(() => {
    getUserProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getUserProducts() {
    const url = `${ENDPOINT}/product/get-all-user-products/${userID}?productID=`;
    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setProducts(response.data.data);

          const products = response.data.data;
          const activeProductsList = products.filter(function (product) {
            if (product.active == true) {
              return true;
            }
          });

          setActiveProductsList(activeProductsList);
          //---------------------------------------
          const underReviewProductsList = products.filter(function (product) {
            if (
              product.reviewed == false &&
              product.verified == false &&
              product.active == false
            ) {
              return true;
            }
          });

          setUnderReviewProductsList(underReviewProductsList);
          //---------------------------------------

          const inactiveProductsList = products.filter(function (product) {
            if (
              product.reviewed == true &&
              product.verified == false &&
              product.active == false
            ) {
              return true;
            }
          });

          setInactiveProductsList(inactiveProductsList);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function handleProductPressed(item) {
    navigation.push("ProductDetails", {
      productID: item._id,
      productOwnerID: item.user._id,
    });
  }

  const activeProducts = () => (
    <>
      {activeProductsList.length < 1 && <NoData text="No data" />}
      <FlatList
        data={activeProductsList}
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
            premium={item.user.premium}
            rating={item.rating.$numberDecimal}
          />
        )}
      />
    </>
  );

  const inactiveProducts = () => (
    <>
      {inactiveProductsList.length < 1 && <NoData text="No data" />}

      <FlatList
        data={inactiveProductsList}
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
            premium={item.user.premium}
          />
        )}
      />
    </>
  );

  const underReviewProducts = () => (
    <>
      {underReviewProductsList.length < 1 && <NoData text="No data" />}

      <FlatList
        data={underReviewProductsList}
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
            premium={item.user.premium}
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
          style={{ color: focused ? colors.lightBlue : colors.gray, margin: 8 }}
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
    <TabView
      renderTabBar={renderTabBar}
      style={styles.container}
      navigationState={{ index: index, routes: routes }}
      renderScene={SceneMap({
        Active: activeProducts,
        UnderReview: underReviewProducts,
        Inactive: inactiveProducts,
      })}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
    />
  );
}

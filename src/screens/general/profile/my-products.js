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
import { showMyToast } from "../../../functions/show-toast";

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

          setActiveProductsList(response.data.data.activeProducts);

          setUnderReviewProductsList(response.data.data.underReviewProducts);

          setInactiveProductsList(response.data.data.inactiveProducts);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
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
            promoted={item.promoted}
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
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
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
            premium={item.user.premium}
            promoted={item.promoted}
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
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
            premium={item.user.premium}
            promoted={item.promoted}
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

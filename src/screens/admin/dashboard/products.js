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
import { ActivityIndicator } from "react-native";

export default function Products({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  let [newProducts, setNewProducts] = useState([]);
  let [approvedProductsList, setApprovedProductsList] = useState([]);
  let [rejectedProductsList, setRejectedProductsList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  let [newReachedEnd, setNewReachedEnd] = useState(false);
  let [approvedReachedEnd, setApprovedReachedEnd] = useState(false);
  let [rejectedReachedEnd, setRejectedReachedEnd] = useState(false);

  let [newPageNumber, setNewPageNumber] = useState(0);
  let [approvedPageNumber, setApprovedPageNumber] = useState(0);
  let [rejectedPageNumber, setRejectedPageNumber] = useState(0);

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
    getNewProducts();
    getApprovedProducts();
    getRejectedProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getNewProducts() {
    const url = `${
      process.env.ENDPOINT
    }/admin/get-new-products?pageNumber=${newPageNumber}&limit=${20}`;
    setLoadingData(true);
    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setNewProducts(response.data.data);
          if (response.data.data.length < 20) {
            setNewReachedEnd(true);
          }
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

  async function getApprovedProducts() {
    const url = `${process.env.ENDPOINT}/admin/get-approved-products`;
    setLoadingData(true);
    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setApprovedProductsList(response.data.data);
          if (response.data.data.length < 20) {
            setApprovedReachedEnd(true);
          }
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

  async function getRejectedProducts() {
    const url = `${process.env.ENDPOINT}/admin/get-rejected-products`;
    setLoadingData(true);
    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setRejectedProductsList(response.data.data);
          if (response.data.data.length < 20) {
            setRejectedReachedEnd(true);
          }
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
    navigation.push("AdminProductDetails", { item });
  }

  //---------------------------------------------
  async function getMoreNewProducts() {
    setNewPageNumber(newPageNumber + 1);
    let url = `${
      process.env.ENDPOINT
    }/admin/get-new-products?pageNumber=${newPageNumber}&limit=${20}`;

    console.log(url);
    if (newReachedEnd == true) {
      return;
    } else {
      await axios
        .get(url, { headers: { "auth-token": token } })
        .then((response) => {
          setLoadingData(false);

          if (response.data.status == "Success") {
            console.log(response.data.data[0].productName);
            setNewProducts([...newProducts, ...response.data.data]);
            if (response.data.data.length < 20) {
              setNewReachedEnd(true);
            }
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
  }

  async function getMoreApprovedProducts() {
    setApprovedPageNumber(approvedPageNumber + 1);
    let url = `${process.env.ENDPOINT}/admin/get-approved-products?pageNumber=${
      approvedPageNumber + 1
    }&limit=${20}`;

    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);
        if (approvedReachedEnd == true) {
          return;
        } else {
          if (response.data.status == "Success") {
            setApprovedProductsList([
              ...approvedProductsList,
              ...response.data.data,
            ]);
            if (response.data.data.length < 20) {
              setApprovedReachedEnd(true);
            }
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function getMoreRejectedProducts() {
    setRejectedPageNumber(rejectedPageNumber + 1);
    let url = `${process.env.ENDPOINT}/admin/get-approved-products?pageNumber=${
      rejectedPageNumber + 1
    }&limit=${20}`;

    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);

        if (rejectedReachedEnd == true) {
          return;
        } else {
          if (response.data.status == "Success") {
            setRejectedProductsList([
              ...rejectedProductsList,
              ...response.data.data,
            ]);
            if (response.data.data.length < 20) {
              setRejectedReachedEnd(true);
            }
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }
  //-----------------------------------

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
            premium={item.user.premium}
            promoted={item.promoted}
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
            verified={item.verified}
            reviewed={item.reviewed}
            active={item.active}
          />
        )}
        onEndReached={() => {
          getMoreNewProducts();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return !newReachedEnd ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>{/* <NoData text="No more data" /> */}</>
          );
        }}
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
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
            premium={item.user.premium}
            promoted={item.promoted}
            verified={item.verified}
            reviewed={item.reviewed}
            active={item.active}
          />
        )}
        onEndReached={() => {
          getMoreApprovedProducts();
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={() => {
          return !approvedReachedEnd ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>{/* <NoData text="No more data" /> */}</>
          );
        }}
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
            rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
            premium={item.user.premium}
            promoted={item.promoted}
            verified={item.verified}
            reviewed={item.reviewed}
            active={item.active}
          />
        )}
        onEndReached={() => {
          getMoreRejectedProducts();
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={() => {
          return !rejectedReachedEnd ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>{/* <NoData text="No more data" /> */}</>
          );
        }}
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

  // if (loadingData) {
  //   return <LoadingIndicator />;
  // }

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

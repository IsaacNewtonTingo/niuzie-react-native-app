import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback } from "react";
import styles from "../../../componets/styles/global-styles";
import { FlatList } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import ProductRequest from "../../../componets/cards/product-request.js";
import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import { showMyToast } from "../../../functions/show-toast";
import { Icon, Input } from "native-base";
import colors from "../../../componets/colors/colors";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { discoverStyles } from "./discover";
import FilterList from "../../../componets/lists/filter";
import { BottomSheet } from "react-native-btr";
import PrimaryButton from "../../../componets/buttons/primary-button";
import NoData from "../../../componets/Text/no-data";
import PostSubCategoryList from "../../../componets/subcategories/post-sub-cat-list";
import { RadioButton } from "react-native-paper";
import { postStyles } from "../../seller/post-product";

const { width } = Dimensions.get("window");
const countiesData = require("../../../assets/data/counties.json");

export default function AllProductRequests({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [subCounties, setSubCounties] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  let [productRequests, setProductRequests] = useState([]);

  const [filterModal, setFilterModal] = useState(false);
  const [countiesModal, setCountiesModal] = useState(false);
  const [subCountiesModal, setSubCountiesModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  let limit = 20;

  const filters = [
    {
      title: "County",
      iconType: "MaterialCommunityIcons",
      iconName: "home-city",
      navTo: "county",
    },
    {
      title: "Sub county",
      iconType: "MaterialCommunityIcons",
      iconName: "city-variant",
      navTo: "subCounty",
    },
  ];

  useEffect(() => {
    getProductRequests();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function resetFilters() {
    setSearchTerm("");
    setCounty("");
    setSubCounty("");
  }

  async function getProductRequests() {
    setLoadingData(true);
    setSubmitting(true);

    let url = `${process.env.ENDPOINT}/buyer-needs/get-all-needs?searchTerm=${searchTerm}&county=${county}&subCounty=${subCounty}&createdAt=${createdAt}&limit=${limit}&pageNumber=${pageNumber}`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        setFilterModal(false);
        setSubmitting(false);

        if (response.data.status == "Success") {
          setProductRequests(response.data.data);

          if (response.data.data.length < 20) {
            setReachedEnd(true);
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
        setSubmitting(false);

        setLoadingData(false);
        console.log(err);
      });
  }

  async function getMoreData() {
    setPageNumber(pageNumber + 1);

    let url = `${
      process.env.ENDPOINT
    }/buyer-needs/get-all-needs?searchTerm=${searchTerm}&county=${county}&subCounty=${subCounty}&createdAt=${createdAt}&limit=${limit}&pageNumber=${
      pageNumber + 1
    }`;

    if (reachedEnd == true) {
      return;
    } else {
      await axios
        .get(url)
        .then((response) => {
          setLoadingData(false);
          if (response.data.status == "Success") {
            setProductRequests([...productRequests, ...response.data.data]);

            if (response.data.data.length < 20) {
              setReachedEnd(true);
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
          setLoadingData(false);
          console.log(err);
        });
    }
  }

  async function handleItemClicked(navTo) {
    if (navTo == "county") {
      setCountiesModal(true);
    } else if (navTo == "subCounty") {
      if (!county) {
        showMyToast({
          status: "info",
          title: "Required field",
          description: "Please select a county first",
        });
      } else {
        setCountiesModal(false);
        setSubCountiesModal(true);
      }
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getProductRequests();
      setRefreshing(false);
    }, 5000);
  }, []);

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={discoverStyles.searchContainer}>
        <Input
          w={{
            base: width - 80,
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
            <TouchableOpacity onPress={() => getProductRequests()}>
              <Icon
                as={<AntDesign name="arrowright" />}
                size={5}
                mr="2"
                color="muted.400"
              />
            </TouchableOpacity>
          }
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            color: colors.lightBlue,
            borderRadius: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            setFilterModal(!filterModal);
          }}
          style={discoverStyles.filterContainer}
        >
          <MaterialCommunityIcons
            name="filter-menu-outline"
            size={24}
            color={colors.lightBlue}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        data={productRequests}
        renderItem={({ item }) => (
          <ProductRequest
            onPress={() =>
              navigation.navigate("ProductRequestDetails", { item })
            }
            item={item}
            style={{
              width: width - 40,
              marginRight: 0,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            tintColor={colors.lightBlue}
            colors={[colors.lightBlue]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={() => {
          getMoreData();
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={() => {
          return !reachedEnd ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              <NoData text="No more data" />
            </>
          );
        }}
      />

      <BottomSheet
        visible={filterModal}
        onBackButtonPress={() => setFilterModal(false)}
        onBackdropPress={() => setFilterModal(false)}
      >
        <View style={[discoverStyles.bottomNavigationView, {}]}>
          <View style={discoverStyles.topOpts}>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={{ color: colors.linkText, fontWeight: "800" }}>
                Reset
              </Text>
            </TouchableOpacity>

            <Text style={{ color: colors.lightBlue, fontWeight: "800" }}>
              Filter
            </Text>

            <TouchableOpacity onPress={() => setFilterModal(false)}>
              <Text style={discoverStyles.close}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={discoverStyles.scrollFilt}>
            {filters.map((item) => (
              <FilterList
                onPress={() => {
                  handleItemClicked(item.navTo);
                }}
                key={item.title}
                iconName={item.iconName}
                iconType={item.iconType}
                title={item.title}
                filterDetail={
                  item.title == "County"
                    ? county
                    : item.title == "Sub county"
                    ? subCounty
                    : ""
                }
              />
            ))}

            <View style={[discoverStyles.radios, { marginTop: 40 }]}>
              <Text
                style={[styles.label, { marginLeft: 10, marginBottom: 10 }]}
              >
                Sort by date posted
              </Text>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value=""
                  status={createdAt === "" ? "checked" : "unchecked"}
                  onPress={() => {
                    setCreatedAt("");
                  }}
                />
                <Text style={postStyles.radioText}>All</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="1"
                  status={createdAt === "1" ? "checked" : "unchecked"}
                  onPress={() => {
                    setCreatedAt("1");
                  }}
                />
                <Text style={postStyles.radioText}>Oldest</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="-1"
                  status={createdAt === "-1" ? "checked" : "unchecked"}
                  onPress={() => {
                    setCreatedAt("-1");
                  }}
                />
                <Text style={postStyles.radioText}>Newest</Text>
              </View>
            </View>
          </ScrollView>

          <PrimaryButton
            disabled={submitting}
            submitting={submitting}
            onPress={getProductRequests}
            buttonTitle="Show results"
            style={{ position: "absolute", bottom: 20, alignSelf: "center" }}
          />

          {countiesModal == true && (
            <View style={discoverStyles.backdrop}>
              <TouchableOpacity
                style={discoverStyles.cancel}
                onPress={() => setCountiesModal(false)}
              >
                <Text style={discoverStyles.close}>Cancel</Text>
              </TouchableOpacity>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={countiesData}
                renderItem={({ item }) => (
                  <PostSubCategoryList
                    onPress={() => {
                      setCounty(item.name == "All counties" ? "" : item.name);
                      setSubCounties(item.sub_counties);
                      setSubCounty("");
                      setCountiesModal(false);
                    }}
                    subCategoryName={item.name}
                  />
                )}
              />
              {countiesData.length < 1 && <NoData text="No data" />}
            </View>
          )}

          {subCountiesModal == true && (
            <View style={discoverStyles.backdrop}>
              <TouchableOpacity
                style={discoverStyles.cancel}
                onPress={() => setSubCountiesModal(false)}
              >
                <Text style={discoverStyles.close}>Cancel</Text>
              </TouchableOpacity>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={subCounties}
                renderItem={({ item }) => (
                  <PostSubCategoryList
                    onPress={() => {
                      setSubCounty(item);
                      setSubCountiesModal(false);
                    }}
                    subCategoryName={item}
                  />
                )}
              />

              {!county && <NoData text="Please select county first" />}
              {subCounties.length < 1 && <NoData text="No data" />}
            </View>
          )}
        </View>
      </BottomSheet>
    </View>
  );
}

const featStyles = StyleSheet.create({});

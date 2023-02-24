import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";

import HorizontalCard from "../../../componets/cards/horizontal-card";
import styles from "../../../componets/styles/global-styles";

import { ENDPOINT } from "@env";
import axios from "axios";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import { Input, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { BottomSheet } from "react-native-btr";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import { postStyles } from "../../seller/post-product";

import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";

import FilterList from "../../../componets/lists/filter";
import NoData from "../../../componets/Text/no-data";
import PostSubCategoryList from "../../../componets/subcategories/post-sub-cat-list";
import { showMyToast } from "../../../functions/show-toast";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const countiesData = require("../../../assets/data/counties.json");

export default function Discover({ navigation }) {
  let [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [condition, setCondition] = useState("");

  const [categoryID, setCategoryID] = useState("");
  const [subCategoryID, setSubCategoryID] = useState("");

  const [price, setPrice] = useState(""); // 1 = Low to high
  const [rating, setRating] = useState(""); // -1 = Highest to lowest
  const [createdAt, setCreatedAt] = useState(""); // -1 = Latest to oldest
  const [promoted, setPromoted] = useState("-1"); // -1 = Promoted true first

  const [filterModal, setFilterModal] = useState(false);
  const [categoriesModal, setCategoriesModal] = useState(false);
  const [subCategoriesModal, setSubCategoriesModal] = useState(false);
  const [countiesModal, setCountiesModal] = useState(false);
  const [subCountiesModal, setSubCountiesModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCounties, setSubCounties] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllProducts();
      setRefreshing(false);
    }, 5000);
  }, []);

  const filters = [
    {
      title: "Category",
      iconType: "Ionicons",
      iconName: "md-shirt-sharp",
      navTo: "category",
    },
    {
      title: "Sub category",
      iconType: "MaterialCommunityIcons",
      iconName: "shoe-sneaker",
      navTo: "subCategory",
    },
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

  async function resetFilters() {
    setSearchTerm("");
    setCounty("");
    setSubCounty("");
    setCategory("");
    setSubCategory("");
    setCondition("");
    setCategoryID("");
    setSubCategoryID("");
    setPrice("");
    setRating("");
    setCreatedAt("");
  }

  let [pageNumber, setPageNumber] = useState(0);
  let limit = 20;

  async function getAllProducts() {
    setLoadingData(true);
    setSubmitting(true);

    let url = `${process.env.ENDPOINT}/product/get-all-products?county=${county}&subCounty=${subCounty}&category=${categoryID}&subCategory=${subCategoryID}&searchTerm=${searchTerm}&condition=${condition}&price=${price}&rating=${rating}&createdAt=${createdAt}&pageNumber=${pageNumber}&limit=${limit}&promoted=${promoted}`;

    await axios
      .get(url)
      .then((response) => {
        setSubmitting(false);
        setLoadingData(false);
        setFilterModal(false);

        if (response.data.status == "Success") {
          setAllProducts(response.data.data);

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
        console.log(err);
        setSubmitting(false);
        setLoadingData(false);
      });
  }

  async function getMoreProducts() {
    setPageNumber(pageNumber + 1);

    let url = `${
      process.env.ENDPOINT
    }/product/get-all-products?county=${county}&subCounty=${subCounty}&category=${categoryID}&subCategory=${subCategoryID}&searchTerm=${searchTerm}&condition=${condition}&price=${price}&rating=${rating}&createdAt=${createdAt}&pageNumber=${
      pageNumber + 1
    }&limit=${limit}&promoted=${promoted}`;

    if (reachedEnd == true) {
      return;
    } else {
      await axios.get(url).then((response) => {
        if (response.data.status == "Success") {
          setAllProducts([...allProducts, ...response.data.data]);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      });
    }
  }

  async function handleProductPressed(item) {
    navigation.navigate("ProductDetails", {
      productID: item._id,
      productOwnerID: item.user._id,
    });
  }

  async function handleItemClicked(navTo) {
    if (navTo == "category") {
      setSubCategoriesModal(false);
      setCategoriesModal(true);
      getCategories();
    } else if (navTo == "subCategory") {
      setSubCategoriesModal(true);
      setCategoriesModal(false);
      getSubCategories();
    } else if (navTo == "county") {
      setSubCategoriesModal(false);
      setCategoriesModal(false);
      setCountiesModal(true);
    } else if (navTo == "subCounty") {
      setSubCategoriesModal(false);
      setCategoriesModal(false);
      setCountiesModal(false);
      setSubCountiesModal(true);
    }
  }

  async function getCategories() {
    setLoadingData(true);
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

  async function getSubCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-sub-categories/${categoryID}`;

    await axios
      .get(url)
      .then((response) => {
        setSubCategories(response.data.data);
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
    <SafeAreaView
      style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
    >
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
            <TouchableOpacity onPress={() => getAllProducts()}>
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

        <TouchableOpacity
          onPress={() => {
            setFilterModal(!filterModal);
            setCategoriesModal(false);
            setSubCategoriesModal(false);
            setCountiesModal(false);
            setSubCountiesModal(false);
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
        refreshControl={
          <RefreshControl
            tintColor={colors.lightBlue}
            colors={[colors.lightBlue]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={() => {
          if (!reachedEnd) {
            getMoreProducts();
          }
        }}
        onEndReachedThreshold={0}
        style={styles.flatlist}
        data={allProducts}
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
        ListFooterComponent={() => {
          return !reachedEnd ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>{/* <NoData text="No more data" /> */}</>
          );
        }}
      />

      {allProducts.length < 1 && <NoData text="No data" />}

      <BottomSheet
        visible={filterModal}
        onBackButtonPress={() => setFilterModal(false)}
        onBackdropPress={() => setFilterModal(false)}
      >
        <View style={discoverStyles.bottomNavigationView}>
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
                  item.title == "Category"
                    ? category
                    : item.title == "Sub category"
                    ? subCategory
                    : item.title == "County"
                    ? county
                    : item.title == "Sub county"
                    ? subCounty
                    : ""
                }
              />
            ))}

            <View style={[discoverStyles.radios, { marginTop: 20 }]}>
              <Text
                style={[styles.label, { marginLeft: 10, marginBottom: 10 }]}
              >
                Condition
              </Text>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value=""
                  status={condition === "" ? "checked" : "unchecked"}
                  onPress={() => {
                    setCondition("");
                  }}
                />
                <Text style={postStyles.radioText}>All</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="New"
                  status={condition === "New" ? "checked" : "unchecked"}
                  onPress={() => {
                    setCondition("New");
                  }}
                />
                <Text style={postStyles.radioText}>New</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="Used, in working conditions"
                  status={
                    condition === "Used, in working conditions"
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => {
                    setCondition("Used, in working conditions");
                  }}
                />
                <Text style={postStyles.radioText}>
                  Used, in working conditions
                </Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="Used, with minor defects"
                  status={
                    condition === "Used, with minor defects"
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => {
                    setCondition("Used, with minor defects");
                  }}
                />
                <Text style={postStyles.radioText}>
                  Used, with minor defects
                </Text>
              </View>
            </View>

            <View style={discoverStyles.radios}>
              <Text
                style={[styles.label, { marginLeft: 10, marginBottom: 10 }]}
              >
                Price
              </Text>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value=""
                  status={price === "" ? "checked" : "unchecked"}
                  onPress={() => {
                    setPrice("");
                  }}
                />
                <Text style={postStyles.radioText}>All</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="1"
                  status={price === "1" ? "checked" : "unchecked"}
                  onPress={() => {
                    setPrice("1");
                  }}
                />
                <Text style={postStyles.radioText}>Low to high</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="-1"
                  status={price === "-1" ? "checked" : "unchecked"}
                  onPress={() => {
                    setPrice("-1");
                  }}
                />
                <Text style={postStyles.radioText}>High to low</Text>
              </View>
            </View>

            <View style={discoverStyles.radios}>
              <Text
                style={[styles.label, { marginLeft: 10, marginBottom: 10 }]}
              >
                Rating
              </Text>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value=""
                  status={rating === "" ? "checked" : "unchecked"}
                  onPress={() => {
                    setRating("");
                  }}
                />
                <Text style={postStyles.radioText}>All</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="1"
                  status={rating === "1" ? "checked" : "unchecked"}
                  onPress={() => {
                    setRating("1");
                  }}
                />
                <Text style={postStyles.radioText}>Low to high</Text>
              </View>

              <View style={discoverStyles.radioContainer}>
                <RadioButton
                  value="-1"
                  status={rating === "-1" ? "checked" : "unchecked"}
                  onPress={() => {
                    setRating("-1");
                  }}
                />
                <Text style={postStyles.radioText}>High to low</Text>
              </View>
            </View>

            <View style={[discoverStyles.radios, { marginBottom: 100 }]}>
              <Text
                style={[styles.label, { marginLeft: 10, marginBottom: 10 }]}
              >
                Date posted
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
            onPress={getAllProducts}
            buttonTitle="Show results"
            style={{ position: "absolute", bottom: 20, alignSelf: "center" }}
          />

          {categoriesModal == true && (
            <View style={discoverStyles.backdrop}>
              <TouchableOpacity
                style={discoverStyles.cancel}
                onPress={() => setCategoriesModal(false)}
              >
                <Text style={discoverStyles.close}>Cancel</Text>
              </TouchableOpacity>

              {loadingData && <LoadingIndicator />}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={categories}
                renderItem={({ item }) => (
                  <PostSubCategoryList
                    onPress={() => {
                      setCategoriesModal(false);
                      setCategory(item.categoryName);
                      setCategoryID(item._id);

                      setSubCategory("");
                      setSubCategoryID("");
                    }}
                    key={item._id}
                    subCategoryName={item.categoryName}
                  />
                )}
              />

              {categories.length < 1 && <NoData text="No data" />}
            </View>
          )}

          {subCategoriesModal == true && (
            <View style={discoverStyles.backdrop}>
              <TouchableOpacity
                style={discoverStyles.cancel}
                onPress={() => setSubCategoriesModal(false)}
              >
                <Text style={discoverStyles.close}>Cancel</Text>
              </TouchableOpacity>

              <FlatList
                data={subCategories}
                renderItem={({ item }) => (
                  <PostSubCategoryList
                    itemKey={item._id}
                    onPress={() => {
                      setSubCategory(item.subCategoryName);
                      setSubCategoryID(item._id);
                      setSubCategoriesModal(false);
                    }}
                    subCategoryID={item._id}
                    subCategoryName={item.subCategoryName}
                  />
                )}
              />

              {!category && <NoData text="Please select category first" />}
              {categories.length.length < 1 && <NoData text="No data" />}
            </View>
          )}

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
    </SafeAreaView>
  );
}

export const discoverStyles = StyleSheet.create({
  bottomNavigationView: {
    height: "90%",
    backgroundColor: colors.cardColor,
    width: width,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 20,
  },
  searchContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    width: width,
  },
  filterContainer: {
    backgroundColor: colors.cardColor,
    padding: 10,
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  scrollFilt: {
    width: width,
    padding: 20,
    alignSelf: "center",
    paddingBottom: 100,
  },
  radios: {
    backgroundColor: colors.cardColor,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: colors.gray,
    padding: 10,
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    color: colors.dark,
    fontWeight: "800",
  },
  label: {
    color: colors.linkText,
    fontWeight: "800",
    marginVertical: 10,
  },
  topOpts: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  backdrop: {
    backgroundColor: "#336699",
    width: width,
    borderRadius: 10,
    padding: 10,
    bottom: 0,
    height: height,
    alignSelf: "center",
    position: "absolute",
    paddingTop: StatusBar.currentHeight + 40,
  },
  catModal: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  close: {
    color: colors.orange,
    fontWeight: "800",
  },
  cancel: {
    width: "100%",
    flexDirection: "row-reverse",
    padding: 20,
  },
});

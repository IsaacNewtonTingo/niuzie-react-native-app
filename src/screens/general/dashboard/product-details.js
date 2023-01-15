import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../../../componets/styles/global-styles";
import { ENDPOINT } from "@env";

import { LinearGradient } from "expo-linear-gradient";

import Carousel from "react-native-reanimated-carousel";

import noImage from "../../../assets/data/noImage";
import colors from "../../../componets/colors/colors";

import { verticalProductCardStyles } from "../../../componets/cards/vertical-product";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";
import reviews from "../../../assets/data/reviews";
import ReviewComponent from "../../../componets/cards/reviews";
import axios from "axios";
import { FlatList } from "react-native";
import HorizontalCard from "../../../componets/cards/horizontal-card";

const width = Dimensions.get("window").width;

const B = (props) => (
  <Text style={{ color: colors.gray }}>{props.children}</Text>
);
export default function ProductDetails({ route, navigation }) {
  const [otherProducts, setOtherProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const productID = route.params.item._id;
  const productName = route.params.item.productName;
  const description = route.params.item.description;
  const categoryID = route.params.item.category;
  const price = route.params.item.price;
  const condition = route.params.item.condition;
  const rating = route.params.item.rating.$numberDecimal;

  const userID = route.params.item.user._id;
  const firstName = route.params.item.user.firstName;
  const lastName = route.params.item.user.lastName;
  const profilePicture = route.params.item.user.profilePicture;
  const county = route.params.item.user.county;
  const subCounty = route.params.item.user.subCounty;

  const [saved, setSaved] = useState(false);

  const [review, setReview] = useState("");
  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    getOtherProducts();
    getSimilarProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  const productImages = [
    route.params.item.image1
      ? route.params.item.image1
      : noImage.noProductImage,
    route.params.item.image2
      ? route.params.item.image2
      : noImage.noProductImage,
    route.params.item.image3
      ? route.params.item.image1
      : noImage.noProductImage,
    route.params.item.image4
      ? route.params.item.image4
      : noImage.noProductImage,
  ];

  async function handleSave() {
    setSaved(!saved);
  }

  const starImgFilled = () => {
    return <AntDesign name="star" color="orange" size={30} />;
  };

  const starImgCorner = () => {
    return <AntDesign name="staro" color="orange" size={30} />;
  };

  const CustomRatingBar = () => {
    return (
      <View style={productDetailStyles.customratingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              onPress={() => setDefaultRating(item)}
              activeOpacity={0.7}
              key={key}
            >
              {item <= defaultRating ? starImgFilled() : starImgCorner()}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  async function getOtherProducts() {
    const url = `${ENDPOINT}/product/get-user-products/${userID}?productID=${productID}`;
    await axios
      .get(url)
      .then((response) => {
        setOtherProducts(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function getSimilarProducts() {
    const url = `${ENDPOINT}/admin/get-category-products/${categoryID}`;
    await axios
      .get(url)
      .then((response) => {
        setSimilarProducts(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  async function handleProductPressed(item) {
    navigation.push("ProductDetails", { item });
  }

  return (
    <ScrollView style={styles.container}>
      <Carousel
        loop
        width={width}
        height={width / 1.2}
        autoPlay={true}
        data={productImages}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 300,
        }}
        // onSnapToItem={
        //   (index) => console.log("current index:", index)
        // }
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: "100%", width: "100%" }}
              source={{ uri: item }}
            />
          </View>
        )}
      />

      <LinearGradient
        colors={[colors.dark, colors.almostDark, colors.dark]}
        style={productDetailStyles.prodData}
      >
        <View style={styles.spaceBetween}>
          <Text style={productDetailStyles.prodNameText}>{productName}</Text>

          <TouchableOpacity onPress={handleSave}>
            {saved ? (
              <MaterialCommunityIcons
                name="heart-multiple"
                size={24}
                color={colors.linkText}
              />
            ) : (
              <MaterialCommunityIcons
                name="heart-multiple-outline"
                size={24}
                color={colors.linkText}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={productDetailStyles.priceText}>KSH. {price}</Text>

        <View style={styles.spaceBetween}>
          <Text style={verticalProductCardStyles.conditionText}>
            {condition}
          </Text>

          <View style={verticalProductCardStyles.ratingContainer}>
            <AntDesign name="star" size={14} color={colors.orange} />
            <Text style={verticalProductCardStyles.ratingText}>{rating}</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={productDetailStyles.descriptionText}>{description}</Text>

      <LinearGradient
        colors={[colors.dark, colors.almostDark, colors.dark]}
        style={[productDetailStyles.prodData, { minHeight: 80 }]}
      >
        <View style={productDetailStyles.profileContainer}>
          <Image
            style={productDetailStyles.profileImage}
            source={{
              uri: profilePicture ? profilePicture : noImage.noProfilePic,
            }}
          />
          <View>
            <Text style={productDetailStyles.nameText}>
              {firstName} {lastName}
            </Text>
            <Text style={productDetailStyles.locationText}>
              {county} {subCounty}
            </Text>
          </View>
        </View>

        <View style={styles.spaceBetween}>
          <PrimaryButton style={{ width: "45%" }} buttonTitle="Call" />
          <TertiaryButton style={{ width: "45%" }} buttonTitle="Text" />
        </View>
      </LinearGradient>

      <View style={[styles.section, { marginTop: 40 }]}>
        <View style={styles.textComb}>
          <Text style={styles.subText}>Reviews</Text>

          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {reviews.map((review) => (
          <ReviewComponent
            firstName={review.firstName}
            lastName={review.lastName}
            profilePicture={review.profilePicture}
            date={review.date}
            rating={review.rating}
            reviewMessage={review.reviewMessage}
          />
        ))}
      </View>

      <View style={[styles.section, {}]}>
        <Text style={styles.subText}>Add review</Text>

        <LinearGradient
          colors={[colors.almostDark, colors.dark]}
          style={[productDetailStyles.prodData, { marginTop: 20, padding: 20 }]}
        >
          <Text style={productDetailStyles.defaultRatingText}>
            {defaultRating.toFixed(1)}
          </Text>
          <CustomRatingBar />

          <View style={styles.textComb}>
            <Text style={styles.label}>Review message</Text>
            <Text style={[styles.label, { color: "gray" }]}>
              {review.length}/200
            </Text>
          </View>

          <View style={styles.textInputContainer}>
            <MaterialIcons
              name="rate-review"
              size={20}
              color={colors.gray}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="e.g The best seller you can get on this platform..."
            />
          </View>

          <PrimaryButton buttonTitle="Add review" />
        </LinearGradient>
      </View>

      <View style={[styles.section, {}]}>
        <Text style={[styles.subText, { marginBottom: 20 }]}>
          Other products by <B>{firstName}</B>
        </Text>

        <FlatList
          horizontal
          data={otherProducts}
          renderItem={({ item }) => (
            <HorizontalCard
              onPress={() => handleProductPressed(item)}
              style={{ width: width - 40, marginRight: 10 }}
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
      </View>

      <View style={[styles.section, {}]}>
        <Text style={[styles.subText, { marginBottom: 20 }]}>
          Similar products
        </Text>

        <FlatList
          horizontal
          data={similarProducts}
          renderItem={({ item }) => (
            <HorizontalCard
              onPress={() => handleProductPressed(item)}
              style={{ width: width - 40, marginRight: 10 }}
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
      </View>
    </ScrollView>
  );
}

const productDetailStyles = StyleSheet.create({
  prodData: {
    minHeight: 150,
    padding: 10,
    borderRadius: 10,
  },
  prodNameText: {
    color: colors.lightBlue,
    fontWeight: "800",
    fontSize: 20,
  },
  priceText: {
    color: colors.orange,
    fontWeight: "800",
    marginVertical: 10,
    fontSize: 14,
  },
  descriptionText: {
    color: colors.lightBlue,
    margin: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },
  locationText: {
    color: colors.linkText,
    fontSize: 12,
    fontWeight: "700",
  },
  customratingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  defaultRatingText: {
    color: colors.lightBlue,
    fontWeight: "800",
    fontSize: 40,
    textAlign: "center",
  },
});

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
import React, { useEffect, useState, useContext } from "react";
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
import ReviewComponent from "../../../componets/cards/reviews";
import axios from "axios";
import { FlatList } from "react-native";
import HorizontalCard from "../../../componets/cards/horizontal-card";
import { showMyToast } from "../../../functions/show-toast";

import dateFormat from "dateformat";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import NoData from "../../../componets/Text/no-data";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

const width = Dimensions.get("window").width;

const B = (props) => (
  <Text style={{ color: colors.gray }}>{props.children}</Text>
);
export default function ProductDetails({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";
  const token = storedCredentials ? data.token : "";

  const [otherProducts, setOtherProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [reviewList, setReviewList] = useState([]);

  const productID = route.params.item._id;
  const productName = route.params.item.productName;
  const description = route.params.item.description;
  const categoryID = route.params.item.category._id;
  const price = route.params.item.price;
  const condition = route.params.item.condition;
  const rating = route.params.item.rating.$numberDecimal;

  const productOwnerID = route.params.item.user._id;
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
    getReviews();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  const headers = {
    "auth-token": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

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

  async function getReviews() {
    await axios
      .get(`${process.env.ENDPOINT}/product/get-product-reviews/${productID}`)
      .then((response) => {
        if (response.data.status == "Success") {
          setReviewList(response.data.data);
        } else {
          showMyToast({
            status: "error",
            title: response.data.status,
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

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

  async function handleProductPressed(item) {
    navigation.push("ProductDetails", { item });
  }

  async function getOtherProducts() {
    let url = `${ENDPOINT}/product/get-user-products/${productOwnerID}?productID=${productID}`;
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
    let url = `${ENDPOINT}/admin/get-category-products/${categoryID}`;
    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setSimilarProducts(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  function validate() {
    if (!review) {
      showMyToast({
        status: "error",
        title: "Required field",
        description:
          "Please right something in the review box before submitting",
      });
    } else if (defaultRating < 1) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Give star rating to this dealer",
      });
    } else {
      reviewProduct();
    }
  }

  async function reviewProduct() {
    setSubmitting(true);

    await axios
      .post(
        `${process.env.ENDPOINT}/product/review-product/${productID}`,
        {
          userID,
          rating,
          reviewMessage: review,
        },
        { headers }
      )
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: response.data.status,
            description: response.data.message,
          });
        } else {
          showMyToast({
            status: "success",
            title: response.data.status,
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  async function deleteReview(reviewID) {
    const url = `https://3058-197-176-255-142.in.ngrok.io/api/product/delete-product-review/${reviewID}?userID=${userID}&&productID=${productID}`;
    await axios
      .delete(url, { headers: headers })
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "Success") {
          getReviews();
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
        } else {
          showMyToast({
            status: "error",
            title: "Something went wrong",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
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
            key={item}
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
        colors={[colors.cardColor, colors.almostDark, colors.dark]}
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
        colors={[colors.dark, colors.almostDark, colors.cardColor]}
        style={[productDetailStyles.prodData, { minHeight: 180 }]}
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

      <View style={[styles.section, { marginTop: 40, minHeight: 200 }]}>
        <View style={[styles.textComb, { marginBottom: 20 }]}>
          <Text style={styles.subText}>Reviews</Text>

          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {reviewList.length < 1 && (
          <NoData text="No reviews found for this product" />
        )}

        {reviewList.map((review) => (
          <ReviewComponent
            key={review._id}
            productOwnerID={productOwnerID}
            firstName={review.user.firstName}
            lastName={review.user.lastName}
            profilePicture={review.user.profilePicture}
            date={dateFormat(review.createdAt, "mediumDate")}
            rating={review.rating}
            reviewMessage={review.reviewMessage}
            onPress={() => deleteReview(review._id)}
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
              value={review}
              onChangeText={setReview}
              placeholder="e.g The best seller you can get on this platform..."
            />
          </View>

          <PrimaryButton
            submitting={submitting}
            disabled={submitting}
            onPress={validate}
            buttonTitle="Add review"
          />
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
              myKey={item._id}
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
    fontSize: 20,
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

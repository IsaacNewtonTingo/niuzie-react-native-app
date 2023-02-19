import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Share,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import styles from "../../../componets/styles/global-styles";
import { ENDPOINT } from "@env";

import { LinearGradient } from "expo-linear-gradient";

import Carousel from "react-native-reanimated-carousel";

import noImage from "../../../assets/data/noImage";
import colors from "../../../componets/colors/colors";

import { verticalProductCardStyles } from "../../../componets/cards/vertical-product";

import {
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

import PrimaryButton from "../../../componets/buttons/primary-button";
import ReviewComponent from "../../../componets/cards/reviews";
import axios from "axios";
import HorizontalCard from "../../../componets/cards/horizontal-card";
import { showMyToast } from "../../../functions/show-toast";

import dateFormat from "dateformat";

import {
  CredentialsContext,
  AuthContext,
} from "../../../componets/context/credentials-context";
import NoData from "../../../componets/Text/no-data";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

const width = Dimensions.get("window").width;

const B = (props) => (
  <Text style={{ color: colors.gray }}>{props.children}</Text>
);
export default function ProductDetails({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { auth, setAuth } = useContext(AuthContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = storedCredentials ? data.userID : "";
  const token = storedCredentials ? data.token : "";

  const [otherProducts, setOtherProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [reviewList, setReviewList] = useState([]);

  let productID = route.params.productID;
  let productOwnerID = route.params.productOwnerID;

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryID, setSubCategoryID] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [rating, setRating] = useState(null);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  const [saved, setSaved] = useState(false);

  const [noProduct, setNoProduct] = useState(false);

  const [review, setReview] = useState("");
  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    getProducts();
    getOtherProducts();
    getReviews();

    if (userID) {
      getSavedProducts();
    }
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  const headers = {
    "auth-token": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  async function getProducts() {
    const url = `${process.env.ENDPOINT}/product/get-one-product/${productID}`;
    setLoadingData(true);
    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Success") {
          setProductName(response.data.data.productName);
          setDescription(response.data.data.description);
          setCategoryID(response.data.data.category._id);
          setCategoryName(response.data.data.category.categoryName);
          setSubCategoryID(response.data.data.subCategory._id);
          setSubCategoryName(response.data.data.subCategory.subCategoryName);
          setPrice(response.data.data.price);
          setCondition(response.data.data.condition);
          setRating(
            parseFloat(response.data.data.rating.$numberDecimal).toFixed(1)
          );

          setImage1(response.data.data.image1);
          setImage2(response.data.data.image2);
          setImage3(response.data.data.image3);
          setImage4(response.data.data.image4);

          setFirstName(response.data.data.user.firstName);
          setLastName(response.data.data.user.lastName);
          setPhoneNumber(response.data.data.user.phoneNumber);
          setProfilePicture(response.data.data.user.profilePicture);
          setCounty(response.data.data.user.county);
          setSubCounty(response.data.data.user.subCounty);

          getSimilarProducts(response.data.data.category._id);
        } else if (response.data.message == "Product not found") {
          setNoProduct(true);
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

  const productImages = [
    image1 ? image1 : noImage.noProductImage,
    image2 ? image2 : noImage.noProductImage,
    image3 ? image1 : noImage.noProductImage,
    image4 ? image4 : noImage.noProductImage,
  ];

  async function getReviews() {
    await axios
      .get(
        `https://9c75-105-163-158-88.in.ngrok.io/api/product/get-product-reviews/${productID}`
      )
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

  async function getSavedProducts() {
    const url = `${process.env.ENDPOINT}/product/get-one-saved-product/${userID}?productID=${productID}`;

    await axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.status == "Success") {
          setSaved(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleSave() {
    if (!userID) {
      showMyToast({
        status: "info",
        title: "Requirement",
        description:
          "You need to login to perform this operation. Signup if you don't have an account",
      });
      setAuth(true);
    } else {
      setSaved(!saved);

      const url = `${process.env.ENDPOINT}/product/save-product/${productID}`;

      await axios
        .post(url, { userID }, { headers })
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    navigation.push("ProductDetails", { productID: item._id });
  }

  async function getOtherProducts() {
    let url = `${ENDPOINT}/product/get-other-user-products/${productOwnerID}?productID=${productID}`;
    await axios
      .get(url)
      .then((response) => {
        if (response.data.status == "Success") {
          setOtherProducts(response.data.data);
        } else {
          console.log(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getSimilarProducts(categoryID) {
    let url = `${ENDPOINT}/admin/get-category-products/${categoryID}`;
    await axios
      .get(url)
      .then((response) => {
        if (response.data.status == "Success") {
          setSimilarProducts(response.data.data);
        } else {
          console.log(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
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
    if (!userID) {
      showMyToast({
        status: "info",
        title: "Requirement",
        description:
          "You need to login to perform this operation. Signup if you don't have an account",
      });
      setAuth(true);
    } else {
      setSubmitting(true);
      await axios
        .post(
          `${process.env.ENDPOINT}/product/review-product/${productID}`,
          {
            userID,
            rating: defaultRating,
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
            getReviews();
            getProducts();
            setReview("");
            setDefaultRating(0);
          }
        })
        .catch((err) => {
          setSubmitting(false);
          console.log(err);
        });
    }
  }

  async function deleteReview(reviewID) {
    const url = `${process.env.ENDPOINT}/product/delete-product-review/${reviewID}?userID=${userID}&&productID=${productID}`;
    ``;
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

  async function handlePhoneAction(action) {
    if (userID) {
      if (action == "call") {
        await Linking.openURL(`tel:+${phoneNumber}`);
      } else {
        await Linking.openURL(`sms:+${phoneNumber}`);
      }
    } else {
      showMyToast({
        status: "info",
        title: "Requirement",
        description:
          "You need to login to perform this operation. Signup if you don't have an account",
      });
      setAuth(true);
      console.log(auth);
    }
  }

  async function shareProduct() {
    try {
      const redirectUrl = Linking.createURL();

      const shareOptions = {
        message: redirectUrl,
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error(error);
    }
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  if (noProduct) {
    return <NoData text="Product not found. Might have been deleted" />;
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

      <View style={[productDetailStyles.prodData, productDetailStyles.hr]}>
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
            ~ {condition} ~
          </Text>

          <View style={verticalProductCardStyles.ratingContainer}>
            <AntDesign name="star" size={14} color={colors.orange} />
            <Text style={verticalProductCardStyles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>

      <View style={[productDetailStyles.prodData, productDetailStyles.hr]}>
        <Text style={productDetailStyles.descSubText}>Description:</Text>
        <Text style={productDetailStyles.descriptionText}>{description}</Text>
      </View>

      <View
        style={[
          productDetailStyles.prodData,
          productDetailStyles.hr,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View style={productDetailStyles.profileContainer}>
          <TouchableOpacity
            onPress={() => {
              if (productOwnerID == userID) {
                navigation.navigate("Profile");
              } else {
                navigation.navigate("PublicProfile", { productOwnerID });
              }
            }}
            style={productDetailStyles.profileContainer}
          >
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
                {county}, {subCounty}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePhoneAction("call")}
            style={productDetailStyles.actionIcons}
          >
            <Feather name="phone-call" size={18} color={colors.lightBlue} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePhoneAction("sms")}
            style={productDetailStyles.actionIcons}
          >
            <FontAwesome5 name="sms" size={20} color={colors.lightBlue} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={shareProduct}
          style={productDetailStyles.actionIcons}
        >
          <FontAwesome name="share-square-o" size={25} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {reviewList.length > 0 && (
        <View style={[styles.section, { marginTop: 40 }]}>
          <View style={[styles.textComb, { marginBottom: 20 }]}>
            <Text style={styles.subText}>
              Reviews <B>({reviewList.length})</B>
            </Text>

            {reviewList.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AllReviews", {
                    productID,
                    userID,
                    productOwnerID,
                  })
                }
              >
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            )}
          </View>

          {reviewList.map((review) => (
            <ReviewComponent
              key={review._id}
              productOwnerID={productOwnerID}
              firstName={review.user.firstName}
              reviewer={review.user._id}
              lastName={review.user.lastName}
              profilePicture={review.user.profilePicture}
              date={dateFormat(review.createdAt, "mediumDate")}
              rating={review.rating.toFixed(1)}
              reviewMessage={review.reviewMessage}
              onPress={() => deleteReview(review._id)}
            />
          ))}
        </View>
      )}

      {userID !== productOwnerID && (
        <View style={[styles.section, {}]}>
          <Text style={styles.subText}>Add review</Text>

          <LinearGradient
            colors={[colors.almostDark, colors.dark]}
            style={[
              productDetailStyles.prodData,
              { marginTop: 20, padding: 20 },
            ]}
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
      )}

      {otherProducts.length > 0 && (
        <View style={[styles.section, { minHeight: 200 }]}>
          <Text style={[styles.subText, { marginBottom: 20 }]}>
            Other products
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
                premium={item.user.premium}
                rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
              />
            )}
          />
        </View>
      )}

      {similarProducts.length > 0 && (
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
                premium={item.user.premium}
                rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
              />
            )}
          />
        </View>
      )}

      {userID == productOwnerID && (
        <View style={[styles.section, {}]}>
          <PrimaryButton
            onPress={() =>
              navigation.navigate("EditProduct", {
                productID,
                productName,
                categoryName,
                categoryID,
                subCategoryName,
                subCategoryID,
                description,
                price,
                condition,
                firstName,
                lastName,
                phoneNumber,
                county,
                subCounty,

                image1,
                image2,
                image3,
                image4,
              })
            }
            buttonTitle="Edit product"
          />
        </View>
      )}

      {userID == productOwnerID && (
        <View style={[styles.section, {}]}>
          <TertiaryButton
            onPress={() =>
              navigation.navigate("EditProduct", {
                productID,
                productName,
                categoryName,
                categoryID,
                subCategoryName,
                subCategoryID,
                description,
                price,
                condition,
                firstName,
                lastName,
                phoneNumber,
                county,
                subCounty,

                image1,
                image2,
                image3,
                image4,
              })
            }
            buttonTitle="Republish product"
          />
        </View>
      )}
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
    marginVertical: 20,
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
  actionIcons: {
    marginHorizontal: 10,
  },
  descSubText: {
    color: colors.gray,
    fontWeight: "800",
    marginTop: 20,
  },
  hr: {
    borderBottomWidth: 0.2,
    borderBottomColor: colors.gray,
  },
});

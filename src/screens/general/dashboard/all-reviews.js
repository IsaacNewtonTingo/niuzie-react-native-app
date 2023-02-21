import { StyleSheet, FlatList, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import ReviewComponent from "../../../componets/cards/reviews";
import axios from "axios";
import dateFormat from "dateformat";
import styles from "../../../componets/styles/global-styles";

export default function AllReviews({ route }) {
  const [reviewList, setReviewList] = useState([]);
  const productID = route.params.productID;
  const productOwnerID = route.params.productOwnerID;
  const userID = route.params.userID;

  useEffect(() => {
    getReviews();
  }, []);

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
  return (
    <View style={[styles.container, { padding: 20 }]}>
      <FlatList
        data={reviewList}
        renderItem={({ item }) => (
          <ReviewComponent
            key={item._id}
            productOwnerID={productOwnerID}
            firstName={item.user.firstName}
            reviewer={item.user._id}
            lastName={item.user.lastName}
            profilePicture={item.user.profilePicture}
            date={dateFormat(item.createdAt, "mediumDate")}
            rating={item.rating.toFixed(1)}
            reviewMessage={item.reviewMessage}
            onPress={() => deleteReview(item._id)}
          />
        )}
      />
    </View>
  );
}

const reviewStyles = StyleSheet.create({});

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import styles from "../styles/global-styles";
import colors from "../colors/colors";

import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function VerticalProductCard(props) {
  const productImage = props.image1;
  const productName = props.productName;
  const price = props.price;
  const condition = props.condition;
  const description = props.description;
  const county = props.county;
  const subCounty = props.subCounty;
  const rating = props.rating;

  return (
    <TouchableOpacity style={verticalProductCardStyles.card}>
      <Image
        style={verticalProductCardStyles.productImage}
        source={{
          uri: "https://www.digitaltrends.com/wp-content/uploads/2022/09/iPhone-14-Pro-Back-Purple-Hand.jpg?p=1",
        }}
      />

      <View style={verticalProductCardStyles.detailsContainer}>
        <View style={verticalProductCardStyles.nameAndCondition}>
          <Text style={verticalProductCardStyles.productNameText}>
            {productName.length <= 13
              ? productName
              : productName.slice(1, 12) + "..."}
          </Text>
          <Text style={verticalProductCardStyles.conditionText}>
            {condition}
          </Text>
        </View>

        <Text style={verticalProductCardStyles.priceText}>Ksh. {price}</Text>

        <Text style={verticalProductCardStyles.descriptionText}>
          {description.length <= 80
            ? description
            : description.slice(1, 79) + "..."}
        </Text>

        <View style={verticalProductCardStyles.locationAndRating}>
          <Text style={verticalProductCardStyles.locationText}>
            {county},{subCounty}
          </Text>

          <View style={verticalProductCardStyles.ratingContainer}>
            <AntDesign name="star" size={14} color={colors.orange} />
            <Text style={verticalProductCardStyles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const verticalProductCardStyles = StyleSheet.create({
  card: {
    width: width / 2.1,
    height: 330,
    backgroundColor: colors.cardColor,
    marginBottom: 20,
    borderRadius: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  detailsContainer: {
    padding: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameAndCondition: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productNameText: {
    color: colors.lightBlue,
    fontSize: 16,
    fontWeight: "800",
  },
  conditionText: {
    color: colors.gray,
    backgroundColor: colors.dark,
    borderRadius: 10,
    padding: 5,
  },
  priceText: {
    color: colors.orange,
    fontWeight: "800",
    marginTop: 5,
  },
  locationText: {
    color: colors.linkText,
    fontWeight: "800",
  },
  ratingText: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginLeft: 5,
  },
  descriptionText: {
    color: colors.abitGray,
    marginVertical: 20,
  },
  locationAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

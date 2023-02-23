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

import noImage from "../../assets/data/noImage";
import PromotedCard from "./promoted";
import { useEffect } from "react";

const { width } = Dimensions.get("window");
export default function HorizontalCard(props) {
  const productImage1 = props.productImage1;
  const productImage2 = props.productImage2;
  const productImage3 = props.productImage3;
  const productImage4 = props.productImage4;
  const productName = props.productName;
  const price = props.price;
  const condition = props.condition;
  const description = props.description;
  const county = props.county;
  const subCounty = props.subCounty;
  const rating = props.rating;
  const onPress = props.onPress;
  const style = props.style;
  const premium = props.premium;
  const promoted = props.promoted;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[verticalProductCardStyles.card, style]}
    >
      {promoted && <PromotedCard />}

      <Image
        style={verticalProductCardStyles.productImage}
        source={{
          uri: productImage1
            ? productImage1
            : productImage2
            ? productImage2
            : productImage3
            ? productImage3
            : productImage4
            ? productImage4
            : noImage.noProductImage,
        }}
      />

      <View style={verticalProductCardStyles.detailsContainer}>
        <View>
          <View style={verticalProductCardStyles.nameAndCondition}>
            <Text style={verticalProductCardStyles.productNameText}>
              {productName}
            </Text>
          </View>

          <Text style={verticalProductCardStyles.conditionText}>
            ~ {condition} ~
          </Text>

          <Text style={verticalProductCardStyles.priceText}>Ksh. {price}</Text>
        </View>

        <Text style={verticalProductCardStyles.descriptionText}>
          {description.length <= 60
            ? description
            : description.slice(0, 59) + "..."}
        </Text>

        <View style={verticalProductCardStyles.locationAndRating}>
          <Text style={verticalProductCardStyles.locationText}>
            {county},{subCounty}
          </Text>

          <View style={verticalProductCardStyles.ratingContainer}>
            <AntDesign name="star" size={10} color={colors.orange} />
            <Text style={verticalProductCardStyles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const verticalProductCardStyles = StyleSheet.create({
  card: {
    width: width - 20,
    minHeight: 160,
    backgroundColor: colors.cardColor,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  productImage: {
    width: 160,
    minHeight: 160,
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 10,
    justifyContent: "space-between",
    flex: 1,
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
    fontSize: 12,
    fontWeight: "800",
  },
  conditionText: {
    color: colors.gray,
    fontSize: 10,
    marginVertical: 5,
  },
  priceText: {
    color: colors.orange,
    fontWeight: "800",
    fontSize: 12,
  },
  locationText: {
    color: colors.linkText,
    fontWeight: "800",
    fontSize: 12,
  },
  ratingText: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginLeft: 5,
    fontSize: 12,
  },
  descriptionText: {
    color: colors.abitGray,
    marginVertical: 20,
    fontSize: 12,
  },
  locationAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
  },
});

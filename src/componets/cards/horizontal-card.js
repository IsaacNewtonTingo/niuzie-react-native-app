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

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[verticalProductCardStyles.card, style]}
    >
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
              {productName.length <= 15
                ? productName
                : productName.slice(0, 14) + "..."}
            </Text>
            <Text style={verticalProductCardStyles.conditionText}>
              {condition.length <= 8
                ? condition
                : condition.slice(0, 7) + "..."}
            </Text>
          </View>

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
    width: width,
    minHeight: 160,
    backgroundColor: colors.cardColor,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  productImage: {
    width: width / 2.5,
    height: "100%",
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
    fontSize: 16,
    fontWeight: "800",
  },
  conditionText: {
    color: colors.gray,
    backgroundColor: colors.dark,
    borderRadius: 10,
    padding: 5,
    fontSize: 10,
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

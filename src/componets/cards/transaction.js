import { StyleSheet, Text, Dimensions, View } from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/global-styles";

import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../colors/colors";

import dateFormat from "dateformat";

export default function Transaction(props) {
  const amount = props.item.amountPaid;
  const phoneNumber = props.item.phoneNumber;
  const date = props.item.createdAt;

  const extraProduct = props.item.extraProduct;
  const productPromotion = props.item.productPromotion;
  const premium = props.item.premium;

  console.log(props.item);

  return (
    <LinearGradient
      start={[0.0, 0.5]}
      end={[1.0, 0.5]}
      locations={[0.0, 1.0]}
      colors={[colors.dark, "#001949"]}
      style={transStyles.background}
    >
      <View style={styles.spaceBetween}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="coins" size={16} color={colors.gray} />
          <Text style={transStyles.tit}>Amount</Text>
        </View>

        <Text style={transStyles.desc}>KSH. {amount.toFixed(2)}</Text>
      </View>

      <View style={styles.spaceBetween}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="calendar-alt" size={16} color={colors.gray} />
          <Text style={transStyles.tit}>Date</Text>
        </View>

        <Text style={transStyles.desc}>{dateFormat(date, "mediumDate")}</Text>
      </View>

      <View style={styles.spaceBetween}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="phone-square-alt" size={16} color={colors.gray} />
          <Text style={transStyles.tit}>Phone number</Text>
        </View>

        <Text style={transStyles.desc}>{phoneNumber}</Text>
      </View>

      <View style={styles.spaceBetween}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="question-circle" size={16} color={colors.gray} />
          <Text style={transStyles.tit}>
            {premium == true
              ? "Premium payment"
              : productPromotion !== null
              ? "Product promotion"
              : extraProduct !== null
              ? "Product payment"
              : "N/A"}
          </Text>
        </View>

        <Text style={transStyles.desc}>
          {productPromotion !== null
            ? productPromotion.productName
            : extraProduct !== null
            ? extraProduct.productName
            : "Joined premium"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const transStyles = StyleSheet.create({
  background: {
    minHeight: 140,
    width: width - 40,
    marginRight: 10,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "space-between",
    alignSelf: "center",
    marginBottom: 10,
  },
  tit: {
    fontWeight: "800",
    fontSize: 14,
    color: colors.gray,
    marginLeft: 10,
  },
  desc: {
    fontWeight: "800",
    fontSize: 14,
    color: colors.lightBlue,
  },
});

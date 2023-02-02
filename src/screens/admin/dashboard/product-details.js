import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React from "react";
import styles from "../../../componets/styles/global-styles";
import Carousel from "react-native-reanimated-carousel";

import noImage from "../../../assets/data/noImage";
import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";

const width = Dimensions.get("window").width;

export default function AdminProductDetails({ route, navigation }) {
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

      <View>
        <View style={prodDetailsStyles.textsCont}>
          <Text>Product name:</Text>
          <Text>{route.params.item.productName}</Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Category:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.category.categoryName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Sub category:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.subCategory.subCategoryName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Price:</Text>
          <Text style={prodDetailsStyles.desc}>{route.params.item.price}</Text>
        </View>
      </View>

      <View>
        <View style={prodDetailsStyles.textsCont}>
          <Text>First name:</Text>
          <Text>{route.params.item.user.firstName}</Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Last name:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.lastName}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Phone number:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.item.user.phoneNumber}
          </Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>County:</Text>
          <Text style={prodDetailsStyles.desc}>{route.params.user.county}</Text>
        </View>

        <View style={prodDetailsStyles.textsCont}>
          <Text style={prodDetailsStyles.sub}>Sub county:</Text>
          <Text style={prodDetailsStyles.desc}>
            {route.params.user.subCounty}
          </Text>
        </View>
      </View>

      <View style={styles.spaceBetween}>
        <PrimaryButton style={{ width: "40%" }} buttonTitle="Approve" />
        <TertiaryButton style={{ width: "40%" }} buttonTitle="Reject" />
      </View>
    </ScrollView>
  );
}

const prodDetailsStyles = StyleSheet.create({
  textsCont: {
    flexDirection: "row",
  },
  sub: {
    color: colors.gray,
    fontWeight: "800",
    marginRight: 10,
  },
  desc: {
    color: colors.lightBlue,
    fontWeight: "800",
  },
});

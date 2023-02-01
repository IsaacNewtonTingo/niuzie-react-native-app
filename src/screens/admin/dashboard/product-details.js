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
    </ScrollView>
  );
}

const prodDetailsStyles = StyleSheet.create({});

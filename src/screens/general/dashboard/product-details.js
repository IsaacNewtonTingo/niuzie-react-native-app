import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import styles from "../../../componets/styles/global-styles";

import Carousel from "react-native-reanimated-carousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import noImage from "../../../assets/data/noImage";

const width = Dimensions.get("window").width;

export default function ProductDetails({ route }) {
  const productID = route.params.item._id;
  const productName = route.params.item.productName;

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
    <ScrollView style={styles.container}>
      <GestureHandlerRootView>
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
      </GestureHandlerRootView>

      <View>
        <Text>{productName}</Text>
      </View>
    </ScrollView>
  );
}

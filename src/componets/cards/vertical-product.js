import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function VerticalProductCard(props) {
  const productImage = props.image1;
  const productName = props.productName;
  return (
    <TouchableOpacity>
      <Image />
      <Text>{productName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

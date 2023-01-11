import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { postStyles } from "../../screens/seller/post-product";

import axios from "axios";
import { ENDPOINT } from "@env";
import { homeStyles } from "../../screens/general/dashboard/home";

import LoadingIndicator from "../preloader/loadingIndicator";
import styles from "../styles/global-styles";

export default function CategoriesComponent(props) {
  const [loadingData, setLoadingData] = useState(true);

  const [categories, setCategories] = useState([]);

  const onPress = (categoryID) => {
    Alert.alert(categoryID);
  };

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const url = `https://niuzie.herokuapp.com/api/admin/get-categories`;

    await axios
      .get(url)
      .then((response) => {
        setCategories(response.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={homeStyles.miniCatContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          onPress={() => onPress(category._id)}
          style={homeStyles.miniCatItem}
          key={category._id}
        >
          <Image
            style={homeStyles.categoryImage}
            source={{ uri: category.categoryImage }}
          />
          <Text style={homeStyles.categoryText}>{category.categoryName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

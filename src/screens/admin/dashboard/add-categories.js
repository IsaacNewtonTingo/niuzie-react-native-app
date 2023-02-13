import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../../../componets/styles/global-styles";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";
import { homeStyles } from "../../general/dashboard/home";
import { LinearGradient } from "expo-linear-gradient";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import colors from "../../../componets/colors/colors";

export default function AddCategories({ navigation }) {
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-categories`;

    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setCategories(response.data.data);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={homeStyles.miniCatContainer}>
          {categories.map((category) => (
            <LinearGradient
              key={category._id}
              start={[0.0, 0.5]}
              end={[1.0, 0.5]}
              locations={[0.0, 1.0]}
              colors={[colors.almostDark, "#001949"]}
              style={homeStyles.miniCatItem}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SubCategoriesAdmin", {
                    categoryID: category._id,
                    categoryName: category.categoryName,
                  });
                }}
              >
                <Image
                  style={homeStyles.categoryImage}
                  source={{ uri: category.categoryImage }}
                />
                <Text style={homeStyles.categoryText}>
                  {category.categoryName}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const addCatStyles = StyleSheet.create({});

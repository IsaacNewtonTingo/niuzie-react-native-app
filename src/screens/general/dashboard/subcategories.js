import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";

import { ENDPOINT } from "@env";
import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import SubCategoryList from "../../../componets/lists/sub-category-list";
import LoadingSkeleton from "../../../componets/preloader/skeleton";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

export default function Subcategories({ route, navigation }) {
  const [subCategories, setSubCategories] = useState([]);

  const [loadingData, setLoadingData] = useState(true);

  const categoryID = route.params.categoryID;

  useEffect(() => {
    getSubCategories();
  }, []);

  async function getSubCategories() {
    const url = `${process.env.ENDPOINT}/admin/get-sub-categories/${categoryID}`;

    await axios
      .get(url)
      .then((response) => {
        setSubCategories(response.data.data);
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
    <View style={styles.container}>
      <FlatList
        data={subCategories}
        renderItem={({ item }) => (
          <SubCategoryList
            onPress={() => {}}
            subCategoryID={item._id}
            subCategoryName={item.subCategoryName}
          />
        )}
      />
    </View>
  );
}

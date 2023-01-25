import { View } from "react-native";
import React from "react";

import { BarIndicator } from "react-native-indicators";
import styles from "../styles/global-styles";

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <BarIndicator size={20} color="white" />
    </View>
  );
}

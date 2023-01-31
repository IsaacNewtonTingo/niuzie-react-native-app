import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import styles from "../../../componets/styles/global-styles";
import colors from "../../../componets/colors/colors";
import MoneyCard from "../../../componets/cards/money-card";

import { Divider, Flex } from "native-base";

const { width } = Dimensions.get("window");

export default function AdminDashboard({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <MoneyCard>
        <View style={{ opacity: 1, padding: 20 }}>
          <Text style={adminDashStyles.subText}>Total revenue</Text>
          <Text style={adminDashStyles.bigText}>KSH. 45000</Text>

          <Flex direction="row">
            <Text style={adminDashStyles.subText}>Premium payments</Text>
            <Divider
              bg="amber.500"
              thickness="2"
              mx="1"
              h="4"
              orientation="vertical"
            />
            <Text style={adminDashStyles.subText}>Product payments</Text>
          </Flex>
        </View>
      </MoneyCard>
    </ScrollView>
  );
}

const adminDashStyles = StyleSheet.create({
  moneyCard: {
    width: width - 40,
    alignSelf: "center",
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    opacity: 0.2,
  },
  subText: {
    color: colors.gray,
  },
  bigText: {
    fontSize: 40,
    color: colors.lightBlue,
    fontWeight: "900",
    marginVertical: 10,
  },
});

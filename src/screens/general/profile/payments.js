import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import styles from "../../../componets/styles/global-styles";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import axios from "axios";
import Transaction from "../../../componets/cards/transaction";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import NoData from "../../../componets/Text/no-data";
import { showMyToast } from "../../../functions/show-toast";

export default function Payments({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { data } = storedCredentials;

  const userID = data.userID;
  const token = data.token;

  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getPayments();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getPayments() {
    const url = `${process.env.ENDPOINT}/payments/get-payments/${userID}`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Success") {
          setTransactions(response.data.data);
        } else {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {transactions.length < 1 && <NoData text="No data found" />}
      <FlatList
        data={transactions}
        renderItem={({ item }) => <Transaction item={item} key={item._id} />}
      />
    </View>
  );
}

const premiumStyles = StyleSheet.create({});

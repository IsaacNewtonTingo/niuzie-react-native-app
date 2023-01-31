import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from "react";

import { CredentialsContext } from "../../../componets/context/credentials-context";

export default function AdminDashboard() {
  const { storeCredentials, setStoreCredentials } =
    useContext(CredentialsContext);

  const { data } = storeCredentials;
  const userID = data.userID;
  return (
    <ScrollView>
      <Text>Home</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

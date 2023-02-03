import { ScrollView, StyleSheet, Text, View } from "react-native";
import React,{useEffect,useState,useContext} from "react";
import styles from "../../../componets/styles/global-styles";
import { CredentialsContext } from "../../../componets/context/credentials-context";


export default function Notifications() {
    const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  

  
  async function getNotifications() {
    
  }
  return <ScrollView style={styles.container}></ScrollView>;
}

const notificationStyles = StyleSheet.create({});

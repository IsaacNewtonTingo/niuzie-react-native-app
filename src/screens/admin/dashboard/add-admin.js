import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../../../componets/styles/global-styles";

export default function AddAdmin() {
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text>AddAdmin</Text>
    </KeyboardAwareScrollView>
  );
}

const addStyles = StyleSheet.create({});

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  View,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BottomSheet } from "react-native-btr";

import styles from "../../../componets/styles/global-styles";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import axios from "axios";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import MyRequests from "../../../componets/cards/my-requests";
import colors from "../../../componets/colors/colors";
import PrimaryButton from "../../../componets/buttons/primary-button";

import { showMyToast } from "../../../functions/show-toast";
import { Modal } from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import TertiaryButton from "../../../componets/buttons/tertiaryBtn";
import NoData from "../../../componets/Text/no-data";

const { width } = Dimensions.get("window");

export default function MyProductRequests({ route }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [editModal, setEditModal] = useState(false);

  const [pressedID, setPressedID] = useState("");
  const [pressedDetails, setPressedDetails] = useState("");

  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    getMyProductRequests();
  }, [route]);

  const headers = {
    "auth-token": token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  async function getMyProductRequests() {
    const url = `${process.env.ENDPOINT}/buyer-needs/get-user-needs/${userID}`;
    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        } else {
          setRequestList(response.data.data);
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  async function handlePressed(item) {
    setPressedID(item._id);
    setPressedDetails(item.content);
    setEditModal(true);
  }

  async function updateRequest() {
    const url = `${process.env.ENDPOINT}/buyer-needs/edit-need/${pressedID}`;
    setSubmitting(true);

    await axios
      .put(url, { userID, content: pressedDetails }, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        } else {
          setEditModal(false);
          getMyProductRequests();
          setPressedDetails("");
          setPressedID("");
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  async function deleteRequest() {
    const url = `${process.env.ENDPOINT}/buyer-needs/delete-need/${pressedID}?userID=${userID}`;
    setSubmitting(true);

    await axios
      .delete(url, { headers })
      .then((response) => {
        setSubmitting(false);

        if (response.data.status == "Failed") {
          showMyToast({
            status: "error",
            title: "Failed",
            description: response.data.message,
          });
        } else {
          setEditModal(false);
          getMyProductRequests();
          setPressedDetails("");
          setPressedID("");
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      {requestList.length < 1 && <NoData text="No data found" />}
      <FlatList
        style={{ marginTop: 20 }}
        showsHorizontalScrollIndicator={false}
        data={requestList}
        renderItem={({ item }) => (
          <MyRequests
            onPress={() => {
              handlePressed(item);
            }}
            item={item}
          />
        )}
      />

      <BottomSheet
        visible={editModal}
        onBackButtonPress={() => setEditModal(false)}
        onBackdropPress={() => setEditModal(false)}
      >
        <View style={prodRequestStyles.innerView}>
          <Text style={[styles.label]}>Edit products request</Text>

          <View style={styles.textInputContainer}>
            <Ionicons
              name="shirt"
              size={18}
              color={colors.gray}
              style={styles.searchIcon}
            />
            <TextInput
              value={pressedDetails}
              onChangeText={setPressedDetails}
              style={[styles.textInput, { color: colors.dark, width: "100%" }]}
              placeholder="e.g Sneakers"
            />
          </View>

          <PrimaryButton
            buttonTitle="Update"
            disabled={submitting}
            submitting={submitting}
            onPress={updateRequest}
          />

          <TertiaryButton
            buttonTitle="Delete"
            disabled={submitting}
            submitting={submitting}
            onPress={deleteRequest}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const prodRequestStyles = StyleSheet.create({
  innerView: {
    backgroundColor: colors.cardColor,
    width: "100%",
    padding: 40,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

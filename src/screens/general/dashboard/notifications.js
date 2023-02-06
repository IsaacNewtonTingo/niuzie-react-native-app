import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";

import { CredentialsContext } from "../../../componets/context/credentials-context";
import { showMyToast } from "../../../functions/show-toast";
import { Avatar } from "react-native-paper";

import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import moment from "moment";
import colors from "../../../componets/colors/colors";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

const { width } = Dimensions.get("window");

export default function Notifications({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = data?.userID;
  const token = data?.token;

  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getNotifications();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getNotifications() {
    const url = `${process.env.ENDPOINT}/user/get-notifications/${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setNotificationsList(response.data.data);
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

  async function handleClicked(item) {
    const notificationID = item._id;
    const url = `${process.env.ENDPOINT}/user/read-notification/${notificationID}?userID=${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .put(url, {}, { headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          getNotifications();
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

    if (item.product !== null) {
      navigation.navigate("ProductDetails", {
        productID: item.product._id,
        productOwnerID: item.product.user._id,
      });
    }
  }

  const currentDate = new Date();
  const currentDateIso = currentDate.toISOString();
  const lastMidnightBasic = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0
  );

  const lastMidnightIso = lastMidnightBasic.toISOString();

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <FlatList
      style={[styles.container, {}]}
      data={notificationsList}
      renderItem={({ item, i }) => (
        <TouchableOpacity
          key={i}
          onPress={() => handleClicked(item)}
          style={[
            notificationStyles.notCont,
            { opacity: item.read == false ? 1 : 0.6 },
          ]}
        >
          <Avatar.Icon
            size={45}
            icon={
              item.title == "Product approved"
                ? "check-decagram"
                : item.title == "Product disapproved"
                ? "close-octagon"
                : "new-box"
            }
          />

          <View style={{ marginLeft: 10, flex: 1 }}>
            <View style={[styles.spaceBetween, { width: "100%" }]}>
              <Text style={notificationStyles.title}>{item.title}</Text>
              <Text style={notificationStyles.date}>
                {item.createdAt >= lastMidnightIso
                  ? moment(item.createdAt).format("LT")
                  : moment(item.createdAt).format("l")}
              </Text>
            </View>

            <Text style={notificationStyles.message}>{item.message}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const notificationStyles = StyleSheet.create({
  notCont: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.1,
    borderBottomColor: colors.gray,
    alignItems: "center",
    width: width - 40,
    alignSelf: "center",
  },
  title: {
    color: colors.lightBlue,
    fontSize: 16,
    fontWeight: "800",
  },
  message: {
    color: colors.gray,
  },
  date: {
    color: colors.gray,
  },
});

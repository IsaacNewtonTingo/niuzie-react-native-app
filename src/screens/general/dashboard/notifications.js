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

import * as Notifications from "expo-notifications";

import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import moment from "moment";
import colors from "../../../componets/colors/colors";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

const { width } = Dimensions.get("window");

export default function NotificationsScreen({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = data?.userID;
  const token = data?.token;

  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    getNotifications();

    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  const handleNotificationResponse = (notification) => {
    if (notification.notification.request.content.data.product) {
      navigation.navigate("ProductDetails", {
        productID: notification.notification.request.content.data.product._id,
        productOwnerID:
          notification.notification.request.content.data.product.user._id,
      });
    }
  };

  async function getNotifications() {
    setLoadingData(true);

    const url = `${process.env.ENDPOINT}/user/get-notifications/${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setNotificationsList(response.data.data.notifications);
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

  async function markAsRead() {
    const url = `${process.env.ENDPOINT}/user/read-all-notifications/${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .put(url, {}, { headers })
      .then((response) => {
        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
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
        console.log(err);
        showMyToast({
          status: "error",
          title: "Failed",
          description: err.message,
        });
      });
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
    <View style={[styles.container, {}]}>
      <View style={notificationStyles.topCont}>
        <TouchableOpacity
          onPress={markAsRead}
          style={notificationStyles.markCont}
        >
          <Text style={notificationStyles.markText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
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
    </View>
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
  topCont: {
    width: width,
    padding: 20,
    alignSelf: "center",
  },
  markCont: {
    alignSelf: "flex-end",
  },
  markText: {
    color: colors.linkText,
    fontWeight: "800",
  },
});

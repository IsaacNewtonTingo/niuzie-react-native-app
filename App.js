import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox, Platform, Linking } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme } from "native-base";

import {
  CredentialsContext,
  NotificationContext,
} from "./src/componets/context/credentials-context";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

import axios from "axios";
import Decider from "./src/navigators/decider";

import { showMyToast } from "./src/functions/show-toast";

Linking.addEventListener("url", handleOpenURL);
Linking.getInitialURL().then((url) => {
  if (url) {
    handleOpenURL({ url });
  }
});

function handleOpenURL({ url }) {
  const productID = url.split("/")[2];
  // navigation.navigate("ProductDetails", { productID });
}

LogBox.ignoreAllLogs();

const newColorTheme = {
  brand: {
    900: "#02030C",
    800: "#12163b",
    700: "#lightBlue",
  },
};
const theme = extendTheme({ colors: newColorTheme });

async function registerForPushNotificationsAsync(userID, authToken) {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    if (userID) {
      const url = `${process.env.ENDPOINT}/user/store-device-token`;
      await axios
        .post(
          url,
          { userID, deviceToken: token },
          { headers: { "auth-token": authToken } }
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.status == "Failed") {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
          }
        })
        .catch((err) => {
          cconsole.log(err);
        });
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const [storedCredentials, setStoredCredentials] = useState("");
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    checkLoginCredentials();
  }, []);

  const checkLoginCredentials = async () => {
    await SecureStore.getItemAsync("loginCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));

          const jsonData = JSON.parse(result);

          const userID = jsonData.data.userID;
          const authToken = jsonData.data.token;

          registerForPushNotificationsAsync(userID, authToken);
          getNotifications(userID, authToken);
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  async function getNotifications(userID, token) {
    const url = `${process.env.ENDPOINT}/user/get-notifications/${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.status == "Success") {
          setNotifications(response.data.data.unread);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}
      >
        <NotificationContext.Provider
          value={{ notifications, setNotifications }}
        >
          <NativeBaseProvider theme={theme}>
            <NavigationContainer>
              <Decider />
              <StatusBar style="light" />
            </NavigationContainer>
          </NativeBaseProvider>
        </NotificationContext.Provider>
      </CredentialsContext.Provider>
    </GestureHandlerRootView>
  );
}

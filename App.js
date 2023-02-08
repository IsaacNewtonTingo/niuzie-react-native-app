import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox, Platform } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigators/tab-navigator";

import { NativeBaseProvider, extendTheme } from "native-base";

import { CredentialsContext } from "./src/componets/context/credentials-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { showMyToast } from "./src/functions/show-toast";

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
      alert("Failed to get push token for push notification!");
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
  const [storedCredentials, setStoredCredentials] = useState("");

  useEffect(() => {
    checkLoginCredentials();
    Notifications.addNotificationReceivedListener(handleNotification);
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
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleNotification = (notification) => {
    showMyToast({
      status: "info",
      title: notification.request.content.title,
      description: notification.request.content.body,
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}
      >
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <TabNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </NativeBaseProvider>
      </CredentialsContext.Provider>
    </GestureHandlerRootView>
  );
}

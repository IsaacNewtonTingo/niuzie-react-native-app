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

import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import axios from "axios";
import styles from "../../../componets/styles/global-styles";
import moment from "moment";
import colors from "../../../componets/colors/colors";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import noImage from "../../../assets/data/noImage";
import { Modal } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Linking } from "react-native";

const { width } = Dimensions.get("window");

export default function Messages({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials ? storedCredentials : "";
  const userID = data?.userID;
  const token = data?.token;

  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [messageModal, setMessageModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    getMessages();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getMessages() {
    const url = `${process.env.ENDPOINT}/admin/get-messages/${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .get(url, { headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setMessageList(response.data.data);
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
    setMessageModal(true);

    setFirstName(item.user.firstName);
    setLastName(item.user.lastName);
    setPhoneNumber(item.user.phoneNumber);
    setMessage(item.message);
    setProfilePicture(item.user.profilePicture);

    const messageID = item._id;
    const url = `${process.env.ENDPOINT}/admin/read-message/${messageID}?userID=${userID}`;
    const headers = {
      "auth-token": token,
    };

    await axios
      .put(url, {}, { headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          getMessages();
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
    <>
      <FlatList
        style={[styles.container, {}]}
        data={messageList}
        renderItem={({ item, i }) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleClicked(item)}
            style={[
              notificationStyles.notCont,
              { opacity: item.read == false ? 1 : 0.6 },
            ]}
          >
            <Avatar.Image
              size={45}
              source={{
                uri: item.profilePicture
                  ? item.profilePicture
                  : noImage.noProfilePic,
              }}
            />

            <View style={{ marginLeft: 10, flex: 1 }}>
              <View style={[styles.spaceBetween, { width: "100%" }]}>
                <Text style={notificationStyles.title}>
                  {item.user.firstName} {item.user.lastName}
                </Text>
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

      <Modal
        backgroundColor={colors.dark}
        isOpen={messageModal}
        onClose={() => setMessageModal(false)}
      >
        <LinearGradient
          start={[0.0, 0.5]}
          end={[1.0, 0.5]}
          locations={[0.0, 1.0]}
          colors={[colors.lightBlue, "#001949"]}
          style={notificationStyles.modalView}
        >
          <TouchableOpacity
            onPress={() => setMessageModal(false)}
            style={{ position: "absolute", right: 20, top: 20 }}
          >
            <AntDesign name="closecircle" size={24} color={colors.lightBlue} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar.Image
              source={{
                uri: profilePicture ? profilePicture : noImage.noProfilePic,
              }}
            />

            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: colors.dark, fontWeight: "700" }}>
                {firstName} {lastName}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:+${phoneNumber}`)}
                  style={{ marginRight: 10 }}
                >
                  <FontAwesome5
                    name="phone-square-alt"
                    size={24}
                    color={colors.gray}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL(`sms:+${phoneNumber}`)}
                >
                  <FontAwesome5 name="sms" size={24} color={colors.gray} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text
            style={{
              color: colors.almostDark,
              marginTop: 20,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            {message}
          </Text>
        </LinearGradient>
      </Modal>
    </>
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
  modalView: {
    width: width - 40,
    padding: 20,
    paddingVertical: 40,
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    justifyContent: "space-between",
  },
});

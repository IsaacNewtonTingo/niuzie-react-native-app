import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import styles from "../../../componets/styles/global-styles";
import colors from "../../../componets/colors/colors";
import MoneyCard from "../../../componets/cards/money-card";

import { Divider, Flex, HStack } from "native-base";
import AdminAction from "../../../componets/cards/admin-actions";

const { width } = Dimensions.get("window");

import { CredentialsContext } from "../../../componets/context/credentials-context";
import axios from "axios";
import { showMyToast } from "../../../functions/show-toast";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

const B = (props) => (
  <Text style={{ fontWeight: "800" }}>{props.children}</Text>
);

export default function AdminDashboard({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { data } = storedCredentials;
  const userID = data.userID;
  const token = data.token;
  const roleID = data.roleID;

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [premiumRevenue, setPremiumRevenue] = useState(0);
  const [extraProductRevenue, setExtraProductRevenue] = useState(0);
  const [productPromoRevenue, setProductPromoRevenue] = useState(0);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenue();
  }, []);

  const adminItems = [
    {
      title: "Products",
      navTo: "Products",
      iconType: "FontAwesome",
      iconName: "shirtsinbulk",
    },
    {
      title: "Categories",
      navTo: "AddCategories",
      iconType: "Ionicons",
      iconName: "shirt-sharp",
    },
    {
      title: "Messages",
      navTo: "Messages",
      iconType: "MaterialCommunityIcons",
      iconName: "message-reply-text-outline",
    },
    {
      title: "Profile",
      navTo: "AdminProfile",
      iconType: "FontAwesome",
      iconName: "user-circle",
    },
  ];

  async function handlePressed({ navTo }) {
    if (navTo == "Products") {
      navigation.navigate("Products");
    } else if (navTo == "AddCategories") {
      navigation.navigate("AddCategories");
    } else if (navTo == "Messages") {
      navigation.navigate("Messages");
    } else if (navTo == "AdminProfile") {
      navigation.navigate("AdminProfile");
    }
  }

  async function getRevenue() {
    const url = `${process.env.ENDPOINT}/admin/get-revenue/${userID}`;

    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);

        if (response.data.status == "Success") {
          setTotalRevenue(response.data.data.totalRevenue);
          setPremiumRevenue(response.data.data.premiumRevenue);
          setExtraProductRevenue(response.data.data.extraProductRevenue);
          setProductPromoRevenue(response.data.data.productPromoRevenue);
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
        setLoadingData(false);
      });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <MoneyCard>
        <View style={{ opacity: 1, padding: 20 }}>
          <Text style={adminDashStyles.subText}>~Total revenue~</Text>
          <Text style={adminDashStyles.bigText}>
            KSH. {roleID == 0 ? totalRevenue.toFixed(2) : "XXXX"}
          </Text>

          <Flex direction="column">
            <HStack>
              <Divider
                bg="amber.500"
                thickness="2"
                mx="1"
                h="4"
                orientation="vertical"
              />
              <Text style={adminDashStyles.subText}>
                Premium payments:{" "}
                <B>KSH.{roleID == 0 ? premiumRevenue.toFixed(2) : "XXXX"}</B>
              </Text>
            </HStack>

            <HStack>
              <Divider
                bg="blue.500"
                thickness="2"
                mx="1"
                h="4"
                orientation="vertical"
              />
              <Text style={adminDashStyles.subText}>
                Product promo payments:{" "}
                <B>
                  KSH.{roleID == 0 ? productPromoRevenue.toFixed(2) : "XXXX"}
                </B>
              </Text>
            </HStack>

            <HStack>
              <Divider
                bg="red.500"
                thickness="2"
                mx="1"
                h="4"
                orientation="vertical"
              />
              <Text style={adminDashStyles.subText}>
                Extra product payments:{" "}
                <B>
                  KSH.{roleID == 0 ? extraProductRevenue.toFixed(2) : "XXXX"}
                </B>
              </Text>
            </HStack>
          </Flex>
        </View>
      </MoneyCard>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 20,
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        {adminItems.map((item) => (
          <AdminAction
            key={item.title}
            item={item}
            onPress={() => handlePressed(item)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const adminDashStyles = StyleSheet.create({
  moneyCard: {
    width: width - 40,
    alignSelf: "center",
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    opacity: 0.2,
  },
  subText: {
    color: colors.gray,
  },
  bigText: {
    fontSize: 40,
    color: colors.lightBlue,
    fontWeight: "900",
    marginVertical: 10,
  },
});

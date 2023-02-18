import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import noImage from "../../../assets/data/noImage";

import { CredentialsContext } from "../../../componets/context/credentials-context";

import styles from "../../../componets/styles/global-styles";
import { showMyToast } from "../../../functions/show-toast";

const { width } = Dimensions.get("window");

import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../../componets/colors/colors";
import LoadingIndicator from "../../../componets/preloader/loadingIndicator";
import HorizontalCard from "../../../componets/cards/horizontal-card";

export default function PublicProfile({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const userID = storedCredentials ? storedCredentials.data.userID : "";
  const token = storedCredentials ? storedCredentials.data.token : "";

  const productOwnerID = route.params.productOwnerID;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  const [sellerProducts, setSellerProducts] = useState([]);

  useEffect(() => {
    getProfile();
  }, [route]);

  async function getProfile() {
    setLoadingData(true);
    const url = `${process.env.ENDPOINT}/product/get-seller-profile/${productOwnerID}`;
    await axios
      .get(url)
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setFirstName(response.data.data.firstName);
          setLastName(response.data.data.lastName);
          setPhoneNumber(response.data.data.phoneNumber);
          setProfilePicture(response.data.data.profilePicture);
          setCounty(response.data.data.county);
          setSubCounty(response.data.data.subCounty);

          getSellerProducts();
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

  async function getSellerProducts() {
    let url = `${process.env.ENDPOINT}/product/get-user-products/${productOwnerID}`;
    await axios
      .get(url)
      .then((response) => {
        if (response.data.status == "Success") {
          setSellerProducts(response.data.data);
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
      });
  }

  async function handleProductPressed(item) {
    navigation.navigate("ProductDetails", {
      productID: item._id,
      productOwnerID: item.user._id,
    });
  }

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={profileStyles.bg}
        source={require("../../../assets/images/bg.jpg")}
      >
        <Avatar.Image
          size={200}
          source={{
            uri: profilePicture ? profilePicture : noImage.noProfilePic,
          }}
        />
      </ImageBackground>

      <View style={profileStyles.cont}>
        <View style={profileStyles.flee}>
          <FontAwesome name="user" size={30} color={colors.gray} />
          <View style={profileStyles.it}>
            <Text style={profileStyles.label}>First name</Text>
            <Text style={profileStyles.may}>{firstName}</Text>
          </View>
        </View>

        <View style={profileStyles.flee}>
          <FontAwesome5 name="user" size={30} color={colors.gray} />
          <View style={profileStyles.it}>
            <Text style={profileStyles.label}>Last name</Text>
            <Text style={profileStyles.may}>{lastName}</Text>
          </View>
        </View>

        <View
          style={[
            styles.spaceBetween,

            {
              marginBottom: 20,
              borderBottomWidth: 0.18,
              paddingBottom: 20,
              borderBottomColor: colors.gray,
            },
          ]}
        >
          <View style={profileStyles.comb}>
            <FontAwesome5
              name="phone-square-alt"
              size={30}
              color={colors.gray}
            />
            <View style={profileStyles.it}>
              <Text style={profileStyles.label}>Phone number</Text>
              <Text style={profileStyles.may}>
                {userID
                  ? phoneNumber
                  : phoneNumber.toString().slice(0, 6) +
                    "XXXXX" +
                    phoneNumber.toString().slice(-1)}
              </Text>
            </View>
          </View>

          {!userID && (
            <TouchableOpacity>
              <Text style={profileStyles.viewText}>View</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={profileStyles.flee}>
          <MaterialCommunityIcons
            name="home-city"
            size={30}
            color={colors.gray}
          />
          <View style={profileStyles.it}>
            <Text style={profileStyles.label}>County</Text>
            <Text style={profileStyles.may}>{county}</Text>
          </View>
        </View>

        <View style={profileStyles.flee}>
          <MaterialCommunityIcons
            name="home-city-outline"
            size={30}
            color={colors.gray}
          />
          <View style={profileStyles.it}>
            <Text style={profileStyles.label}>Sub county</Text>
            <Text style={profileStyles.may}>{subCounty}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.subText, { marginLeft: 10, marginBottom: 20 }]}>
        Products by {lastName}
      </Text>

      {sellerProducts.map((item) => (
        <HorizontalCard
          onPress={() => handleProductPressed(item)}
          style={{ marginBottom: 10 }}
          key={item._id}
          productImage1={item.image1}
          productImage2={item.image2}
          productImage3={item.image3}
          productImage4={item.image4}
          productName={item.productName}
          price={item.price}
          condition={item.condition}
          description={item.description}
          county={item.user.county}
          subCounty={item.user.subCounty}
          rating={parseFloat(item.rating.$numberDecimal).toFixed(1)}
          premium={item.user.premium}
        />
      ))}
    </ScrollView>
  );
}

const profileStyles = StyleSheet.create({
  bg: {
    width: width,
    height: width / 1.7,
    alignItems: "center",
    justifyContent: "center",
  },
  cont: {
    padding: 20,
  },
  label: {
    fontWeight: "800",
    color: colors.gray,
  },
  may: {
    fontWeight: "800",
    color: colors.lightBlue,
  },
  flee: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 0.18,
    borderBottomColor: colors.gray,
    paddingBottom: 20,
  },
  it: {
    marginLeft: 10,
  },
  viewText: {
    fontWeight: "800",
    color: colors.linkText,
  },
  comb: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 20,
    // borderBottomWidth: 0.18,
    // paddingBottom: 20,
  },
});

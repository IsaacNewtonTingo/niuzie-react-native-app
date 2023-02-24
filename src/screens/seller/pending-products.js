import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { Button, Divider, HStack, Modal } from "native-base";

import {
  CredentialsContext,
  PendingProductsContext,
} from "../../componets/context/credentials-context";
import { postStyles } from "./post-product";
import { showMyToast } from "../../functions/show-toast";
import { BarIndicator } from "react-native-indicators";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";
import NoData from "../../componets/Text/no-data";
import PrimaryButton from "../../componets/buttons/primary-button";
import HorizontalCard from "../../componets/cards/horizontal-card";
import styles from "../../componets/styles/global-styles";
import colors from "../../componets/colors/colors";
import LoadingIndicator from "../../componets/preloader/loadingIndicator";

const { width } = Dimensions.get("window");

export default function PendingProducts({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { pendingProducts, setPendingProducts } = useContext(
    PendingProductsContext
  );
  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");

  const [paymentModal, setPaymentModal] = useState(false);
  const [pendingProductList, setPendingProductList] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  var phoneNumberRegex = /^(\+254|0)[17]\d{8}$/;

  useEffect(() => {
    checkStoreCredentials();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function checkStoreCredentials() {
    const { data } = storedCredentials ? storedCredentials : "";

    if (data) {
      getSetPrice(data.userID, data.token);
      setUserID(data.userID);
      setToken(data.token);
    } else {
      setUserID("");
      setToken("");

      showMyToast({
        status: "info",
        title: "Requirement",
        description:
          "You need to login to access this functionality. Signup if you don't have an account",
      });
    }
  }

  async function getSetPrice(userID, token) {
    const url = `${process.env.ENDPOINT}/admin/get-charge/${process.env.EXTRA_PRODUCT_PAY_ID}`;

    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        if (response.data.status == "Success") {
          setPrice(response.data.data.amount);
          getPendingProducts(userID, token, response.data.data.amount);
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

  async function getPendingProducts(userID, token, price) {
    const url = `${process.env.ENDPOINT}/product/get-pending-products/${userID}`;
    setLoadingData(true);
    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setPendingProductList(response.data.data);
          setPendingProducts(response.data.data.length);
          setTotalPrice(price * response.data.data.length);

          if (response.data.data.length > 0) {
            setPhoneNumber(
              "0" +
                response.data.data[0].user.phoneNumber.toString().substring(3)
            );
          }
        } else {
          setLoadingData(false);
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

  async function publishManyProducts() {
    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Phone number is required",
      });
    } else if (!phoneNumberRegex.test(phoneNumber)) {
      showMyToast({
        status: "error",
        title: "Invalid input",
        description:
          "Invalid phone number. Make sure phone number is in the format 07xxxxxxxx / 01xxxxxxxx / +2547xxxxxxxx / +2541xxxxxxxx",
      });
    } else {
      const url = `${process.env.ENDPOINT}/product/insert-many-products`;
      setSubmitting(true);

      const headers = {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      let accountNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const newPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber.substring(1)
        : phoneNumber.startsWith("0")
        ? "254" + phoneNumber.substring(1)
        : phoneNumber;

      await axios
        .post(
          url,
          {
            userID,
            phoneNumber: newPhoneNumber,
            amount: totalPrice,
            accountNumber,
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          setSubmitting(false);
          if (response.data.status == "Success") {
            setPaymentModal(false);
            getPendingProducts(userID, token, price);
            setPendingProducts(0);
            showMyToast({
              status: "success",
              title: "Success",
              description: response.data.message,
            });
          } else {
            showMyToast({
              status: "error",
              title: "Failed",
              description: response.data.message,
            });
          }
        })
        .catch((err) => {
          setSubmitting(false);
          console.log(err);
        });
    }
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
    <View style={styles.container}>
      {pendingProductList.length < 1 && (
        <NoData text="No pending products found" />
      )}

      {paymentModal == true && (
        <Modal
          backgroundColor={colors.dark}
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
        >
          <Modal.Content width={width - 40} maxWidth={width - 40}>
            <Modal.CloseButton />

            <Modal.Header color={colors.lightBlue}>
              Pay to submit product for review
            </Modal.Header>

            <Modal.Body>
              <Text style={{ marginBottom: 20, color: colors.dark }}>
                In order to post this product, you will have to pay KSH.{" "}
                {totalPrice.toFixed(2)}. Ensure the number provided below is
                your M-Pesa number and click pay. You will recive an M-Pesa
                prompt to input your pin to complete the payment process.
              </Text>

              <Text style={postStyles.label}>Phone number</Text>
              <View style={styles.textInputContainer}>
                <MaterialCommunityIcons
                  style={styles.searchIcon}
                  name="hand-coin-outline"
                  size={18}
                  color={colors.dark}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g 0726776789"
                  keyboardType="numeric"
                  value={phoneNumber.toString()}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <Text style={postStyles.label}>Amount</Text>
              <View style={styles.textInputContainer}>
                <MaterialCommunityIcons
                  style={styles.searchIcon}
                  name="hand-coin-outline"
                  size={18}
                  color={colors.dark}
                />
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={totalPrice.toString()}
                  editable={false}
                />
              </View>
            </Modal.Body>

            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  width={100}
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setPaymentModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  width={100}
                  disabled={submitting}
                  onPress={publishManyProducts}
                >
                  {submitting == false ? (
                    "Pay"
                  ) : (
                    <BarIndicator color="white" size={20} />
                  )}
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}

      {totalPrice !== 0 && (
        <ImageBackground
          style={postStyles.topIMG}
          source={require("../../assets/images/mt.jpg")}
        >
          <Image
            style={postStyles.safLogo}
            source={require("../../assets/images/safaricom.png")}
          />
          <Text style={postStyles.descText}>
            In order to make the below product(s) live, please complete the
            payment.
          </Text>

          <HStack>
            <Text style={postStyles.amountText}>
              Ksh. {totalPrice.toFixed(2)}
            </Text>
            <Divider
              bg="amber.500"
              thickness="2"
              mx="2"
              orientation="vertical"
            />
            <Text style={postStyles.amountText}>
              Ksh. {price.toFixed(2)} per product
            </Text>
          </HStack>

          <PrimaryButton
            onPress={() => setPaymentModal(true)}
            buttonTitle="Pay now"
          />
        </ImageBackground>
      )}

      <FlatList
        style={{ marginTop: 20 }}
        data={pendingProductList}
        renderItem={({ item }) => (
          <HorizontalCard
            onPress={() => handleProductPressed(item)}
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
            promoted={item.promoted}
          />
        )}
      />
    </View>
  );
}

const pendingStyles = StyleSheet.create({});

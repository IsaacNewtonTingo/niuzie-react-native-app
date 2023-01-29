import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { Divider, Flex, Modal, Button } from "native-base";

import styles from "../../../componets/styles/global-styles";
import colors from "../../../componets/colors/colors";

import PrimaryButton from "../../../componets/buttons/primary-button";

import { postStyles } from "../../seller/post-product";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { CredentialsContext } from "../../../componets/context/credentials-context";
import { showMyToast } from "../../../functions/show-toast";

import LoadingIndicator from "../../../componets/preloader/loadingIndicator";

import axios from "axios";
const { width } = Dimensions.get("window");

export default function PremiumServices({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { data } = storedCredentials;

  const userID = data.userID;
  const token = data.token;

  const [premium, setPremium] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [amount, setAmount] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [paymentModal, setPaymentModal] = useState(false);

  useEffect(() => {
    getUserData();
    getAmount();
  }, [(loading, navigation)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getAmount() {
    const url = `${process.env.ENDPOINT}/admin/get-charge/${process.env.premiumSubscriptionID}`;
    const headers = {
      "auth-token": token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    await axios
      .get(url, { headers: headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setAmount(response.data.data.amount);
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  async function getUserData() {
    const url = `${process.env.ENDPOINT}/user/get-user-data/${userID}`;

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(url, { headers: headers })
      .then((response) => {
        setLoadingData(false);
        if (response.data.status == "Success") {
          setPremium(response.data.data.premium);
          setPhoneNumber(response.data.data.phoneNumber);
        } else {
          setPremium(false);
        }
      })
      .catch((err) => {
        setLoadingData(false);
        console.log(err);
      });
  }

  const benefits = [
    "Unlimited number of products",
    "Products immediately go live",
    "View buyer contact details",
    "Products at the top of suggestions",
    "24 hr support",
  ];

  function validate() {
    if (!phoneNumber) {
      showMyToast({
        status: "error",
        title: "Required field",
        description: "Phone number is required",
      });
    } else {
      joinPremium();
    }
  }

  async function joinPremium() {
    const url = `${process.env.ENDPOINT}/premium/join-premium/${userID}`;
    const headers = {
      "auth-token": token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    setSubmitting(true);

    await axios
      .post(url, { phoneNumber }, { headers: headers })
      .then((response) => {
        setSubmitting(false);
        console.log(response.data);

        if (response.data.status == "Success") {
          showMyToast({
            status: "success",
            title: "Success",
            description: response.data.message,
          });
          setPremium(true);
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

  if (loadingData) {
    return <LoadingIndicator />;
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/bg.png")}
      style={[styles.container, { justifyContent: "center" }]}
    >
      {paymentModal == true && (
        <Modal
          backgroundColor={colors.dark}
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
        >
          <Modal.Content width={width - 40} maxWidth={width - 40}>
            <Modal.CloseButton />
            <Modal.Header>Pay to join premium</Modal.Header>

            <Modal.Body>
              <Text style={{ marginBottom: 20, color: colors.dark }}>
                Ensure the number provided below is your M-Pesa number and click
                pay. You will recive an M-Pesa prompt to input your pin to
                complete the payment process.
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
                  placeholder="e.g 1200"
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
                  value={amount.toString()}
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
                <Button width={100} disabled={submitting} onPress={validate}>
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

      <LinearGradient
        start={[0.0, 0.5]}
        end={[1.0, 0.5]}
        locations={[0.0, 1.0]}
        colors={[colors.almostDark, "#001949"]}
        style={postStyles.holdingContainer}
      >
        <Flex direction="row" h="58" p="4">
          <Text style={premiumStyles.subText}>7-Day plan</Text>
          <Divider bg="amber.500" thickness="2" mx="2" orientation="vertical" />
          <Text style={premiumStyles.subText}>KSH. 200</Text>
        </Flex>

        <Divider
          my="2"
          _light={{
            bg: "muted.800",
          }}
          _dark={{
            bg: "muted.50",
          }}
          style={{ marginTop: 20, marginBottom: 20 }}
        />

        <View style={{ marginVertical: 20 }}>
          {benefits.map((benefit, key) => (
            <View key={key} style={premiumStyles.benefitsContainer}>
              <MaterialCommunityIcons
                name="crown-circle-outline"
                size={24}
                color={colors.orange}
              />

              <Text style={premiumStyles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <Divider
          my="2"
          _light={{
            bg: "muted.800",
          }}
          _dark={{
            bg: "muted.50",
          }}
          style={{ marginTop: 20, marginBottom: 20 }}
        />

        <Text style={{ color: colors.gray }}>
          After 7 days, you will lose your premium membership but you can still
          renew it once the period is over. Payment is done via M-Pesa.
        </Text>

        <PrimaryButton
          onPress={() => setPaymentModal(true)}
          submitting={submitting}
          disabled={submitting || premium}
          buttonTitle={
            premium == false ? "Join now" : "You're already a premium member"
          }
        />
      </LinearGradient>
    </ImageBackground>
  );
}

const premiumStyles = StyleSheet.create({
  headerText: {
    color: colors.orange,
    fontWeight: "900",
    fontSize: 20,
  },
  subText: {
    textAlign: "center",
    color: colors.lightBlue,
    fontWeight: "800",
    fontSize: 18,
  },
  benefitsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  benefitText: {
    color: colors.lightBlue,
    marginLeft: 20,
  },
});

import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { Modal } from "native-base";

import { CredentialsContext } from "../../componets/context/credentials-context";
import axios from "axios";
import { showMyToast } from "../../functions/show-toast";

export default function PendingProducts() {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const userID = storedCredentials.data.userID;
  const token = storedCredentials.data.token;

  const [paymentModal, setPaymentModal] = useState(false);
  const [pendingProductList, setPendingProductList] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    getPendingProducts();
  }, [(navigation, loading)]);

  navigation.addListener("focus", () => setLoading(!loading));

  async function getPendingProducts(userID, token) {
    const url = `${process.env.ENDPOINT}/product/get-pending-products/${userID}`;
    await axios
      .get(url, { headers: { "auth-token": token } })
      .then((response) => {
        if (response.data.status == "Success") {
          setPendingProductList(response.data.data);
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

  async function publishManyProducts() {
    const url = `${process.env.ENDPOINT}/product/insert-many-products`;
    setSubmitting(true);

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "aSpplication/json",
    };

    let accountNumber = Math.floor(100000 + Math.random() * 900000).toString();

    await axios
      .post(
        url,
        {
          userID,
          phoneNumber,
          amount: 2,
          accountNumber,
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setSubmitting(false);
        if (response.data.status == "Success") {
          setPaymentModal(false);
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

  return (
    <View>
      {pendingProductList.length < 1 && <NoData text="No data" />}

      {paymentModal == true && (
        <Modal
          backgroundColor={colors.dark}
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
        >
          <Modal.Content width={width - 40} maxWidth={width - 40}>
            <Modal.CloseButton />
            <Modal.Header>Pay to submit product for review</Modal.Header>

            <Modal.Body>
              <Text style={{ marginBottom: 20, color: colors.dark }}>
                In order to post this product, you will have to pay KSH. 500.
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
                  value="200"
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
          <Text style={postStyles.amountText}>Ksh. 400 </Text>
          <Divider bg="amber.500" thickness="2" mx="2" orientation="vertical" />
          <Text style={postStyles.amountText}>Per product</Text>
        </HStack>

        <PrimaryButton
          onPress={() => setPaymentModal(true)}
          buttonTitle="Pay now"
        />
      </ImageBackground>

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
          />
        )}
      />
    </View>
  );
}

const pendingStyles = StyleSheet.create({});

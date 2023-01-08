import { StyleSheet, Text, View } from "react-native";
import React from "react";
import styles from "../styles/global-styles";
import { VStack, HStack, IconButton, Alert, CloseIcon } from "native-base";

export default function CenteredAlert(props) {
  const alertMessage = props.alertMessage;
  const alertStatus = props.alertStatus;
  const onPress = props.onPress;

  return (
    <View style={styles.backDrop}>
      <Alert w="100%" status={alertStatus}>
        <VStack space={2} flexShrink={1} w="100%">
          <HStack flexShrink={1} space={2} justifyContent="space-between">
            <HStack space={2} flexShrink={1}>
              <Alert.Icon mt="1" />
              <Text fontSize="md" color="coolGray.800">
                {alertMessage}
              </Text>
            </HStack>

            <IconButton
              onPress={onPress}
              variant="unstyled"
              _focus={{
                borderWidth: 0,
              }}
              icon={<CloseIcon size="3" />}
              _icon={{
                color: "coolGray.600",
              }}
            />
          </HStack>
        </VStack>
      </Alert>
    </View>
  );
}

import React from "react";
import { Alert, Box, VStack, Text, Center } from "native-base";

export default function StaticAlert(props) {
  const status = props.status;
  const title = props.title;
  const description = props.description;
  return (
    <Center>
      <Alert alignSelf="center" w="90%" status={status}>
        <VStack space={1} flexShrink={1} w="100%" alignItems="center">
          <Alert.Icon size="md" />
          <Text
            fontSize="md"
            fontWeight="medium"
            _dark={{
              color: "coolGray.800",
            }}
          >
            {title}
          </Text>

          <Box
            _text={{
              textAlign: "center",
            }}
            _dark={{
              _text: {
                color: "coolGray.600",
              },
            }}
          >
            {description}
          </Box>
        </VStack>
      </Alert>
    </Center>
  );
}

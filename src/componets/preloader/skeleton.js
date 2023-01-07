import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Center, VStack, Skeleton } from "native-base";

export default function LoadingSkeleton() {
  return (
    <Center w="350">
      <VStack
        w="100%"
        h="100%"
        maxW="400"
        borderWidth="1"
        space={8}
        overflow="hidden"
        rounded="md"
        _dark={{
          borderColor: "coolGray.500",
        }}
        _light={{
          borderColor: "coolGray.200",
        }}
      >
        <Skeleton h="40" />
        <Skeleton.Text px="4" />
        <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
      </VStack>
    </Center>
  );
}

const styles = StyleSheet.create({});

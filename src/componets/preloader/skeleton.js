import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Center, VStack, Skeleton, HStack } from "native-base";
import styles from "../styles/global-styles";

export default function LoadingSkeleton() {
  return (
    <View style={styles.container}>
      <HStack
        w="100%"
        maxW="400"
        borderWidth="1"
        space={8}
        rounded="md"
        _dark={{
          borderColor: "coolGray.500",
        }}
        _light={{
          borderColor: "coolGray.200",
        }}
        p="4"
      >
        <Skeleton flex="1" h="150" rounded="md" startColor="tertiary.900" />
        <VStack flex="3" space="4">
          <Skeleton startColor="amber.300" />
          <Skeleton.Text />
          <HStack space="2" alignItems="center">
            <Skeleton size="5" rounded="full" />
            <Skeleton h="3" flex="2" rounded="full" />
            <Skeleton h="3" flex="1" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>

      <HStack
        w="100%"
        maxW="400"
        borderWidth="1"
        space={8}
        rounded="md"
        _dark={{
          borderColor: "coolGray.500",
        }}
        _light={{
          borderColor: "coolGray.200",
        }}
        p="4"
      >
        <Skeleton flex="1" h="150" rounded="md" startColor="tertiary.900" />
        <VStack flex="3" space="4">
          <Skeleton startColor="amber.300" />
          <Skeleton.Text />
          <HStack space="2" alignItems="center">
            <Skeleton size="5" rounded="full" />
            <Skeleton h="3" flex="2" rounded="full" />
            <Skeleton h="3" flex="1" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>

      <HStack
        w="100%"
        maxW="400"
        borderWidth="1"
        space={8}
        rounded="md"
        _dark={{
          borderColor: "coolGray.500",
        }}
        _light={{
          borderColor: "coolGray.200",
        }}
        p="4"
      >
        <Skeleton flex="1" h="150" rounded="md" startColor="tertiary.900" />
        <VStack flex="3" space="4">
          <Skeleton startColor="amber.300" />
          <Skeleton.Text />
          <HStack space="2" alignItems="center">
            <Skeleton size="5" rounded="full" />
            <Skeleton h="3" flex="2" rounded="full" />
            <Skeleton h="3" flex="1" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
    </View>
  );
}

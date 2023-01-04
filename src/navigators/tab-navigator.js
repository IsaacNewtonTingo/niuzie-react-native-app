import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeNav from "./home-nav";
import DiscoverNav from "./discover-nav";
import PostProductNav from "./post-product-nav";
import NotificationsNav from "./notifications";
import SettingsNav from "./settings-nav";
import colors from "../componets/colors/colors";

import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.orange,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.bar,
        },
      }}
    >
      <Tab.Screen
        name="HomeNav"
        component={HomeNav}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons name="md-home" size={24} color={colors.lightBlue} />
            );
          },
        }}
      />
      <Tab.Screen
        name="DiscoverNav"
        component={DiscoverNav}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialIcons
                name="local-fire-department"
                size={27}
                color={colors.lightBlue}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="PostProductNav"
        component={PostProductNav}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialIcons
                name="add-box"
                size={26}
                color={colors.lightBlue}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="NotificationsNav"
        component={NotificationsNav}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name="bell-outline"
                size={26}
                color={colors.lightBlue}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="SettingsNav"
        component={SettingsNav}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialIcons
                name="settings"
                size={26}
                color={colors.lightBlue}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

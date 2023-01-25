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
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.lightBlue,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
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
            return <Ionicons name="md-home" size={24} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name="DiscoverNav"
        component={DiscoverNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome name="search" size={27} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name="PostProductNav"
        component={PostProductNav}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <MaterialIcons name="add-box" size={26} color={color} />;
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
                color={color}
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
            return <MaterialIcons name="settings" size={26} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

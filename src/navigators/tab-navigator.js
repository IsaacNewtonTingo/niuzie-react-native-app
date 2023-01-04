import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeNav from "./home-nav";
import DiscoverNav from "./discover-nav";
import PostProductNav from "./post-product-nav";
import NotificationsNav from "./notifications";
import SettingsNav from "./settings-nav";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="HomeNav" component={HomeNav} />
      <Tab.Screen name="DiscoverNav" component={DiscoverNav} />
      <Tab.Screen name="PostProductNav" component={PostProductNav} />
      <Tab.Screen name="NotificationsNav" component={NotificationsNav} />
      <Tab.Screen name="SettingsNav" component={SettingsNav} />
    </Tab.Navigator>
  );
}

import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useContext } from "react";
import colors from "../colors/colors";

import { AuthContext } from "../context/credentials-context";

export default function CancelAuth() {
  const { auth, setAuth } = useContext(AuthContext);

  return (
    <TouchableOpacity onPress={() => setAuth(false)}>
      <Text style={cancelStyles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  );
}

const cancelStyles = StyleSheet.create({
  cancelText: {
    fontWeight: "800",
    color: colors.orange,
    fontSize: 16,
    textAlign: "right",
  },
});

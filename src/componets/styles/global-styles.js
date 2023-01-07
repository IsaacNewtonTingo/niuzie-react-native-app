import { StyleSheet } from "react-native";
import colors from "../colors/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },

  searchContainer: {
    marginTop: 20,
  },

  searchIcon: {
    position: "absolute",
    zIndex: 1,
    top: 15,
    left: 10,
  },

  searchBar: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 40,
    backgroundColor: colors.lightBlue,
  },

  subText: {
    color: colors.lightBlue,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 20,
  },
  section: {
    marginVertical: 20,
  },
  textComb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAll: {
    color: colors.linkText,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  textInputContainer: {
    marginVertical: 10,
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: colors.inputBG,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0066FF",
    paddingHorizontal: 35,
    color: colors.lightBlue,
    fontSize: 12,
  },
  label: {
    fontWeight: "800",
    color: colors.lightBlue,
  },
});

export default styles;

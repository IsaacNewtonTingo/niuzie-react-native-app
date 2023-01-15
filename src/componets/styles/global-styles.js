import { StyleSheet } from "react-native";
import colors from "../colors/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },

  searchContainer: {
    marginTop: 20,
    marginHorizontal: 10,
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
    color: colors.orange,
    fontWeight: "800",
    fontSize: 18,
  },
  section: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  textComb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
    color: colors.dark,
    fontSize: 12,
  },
  label: {
    fontWeight: "800",
    color: colors.lightBlue,
  },
  optTextSign: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  firstText: {
    color: colors.lightBlue,
    fontWeight: "800",
    marginRight: 10,
  },
  opt2Text: {
    fontWeight: "800",
    color: colors.orange,
  },
  backDrop: {
    backgroundColor: "rgba(0,0,0,0.9)",
    height: "100%",
    position: "absolute",
    zIndex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default styles;

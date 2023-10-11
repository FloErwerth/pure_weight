import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  stack: {
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
  },
  titleWrapper: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  headerWrapper: {
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    paddingRight: 20,
  },
  addWrapper: { padding: 16, backgroundColor: "white", borderRadius: 10 },

  errorBox: {
    overflow: "visible",
    color: "rgb(185,28,28)",
    height: 20,
  },
  workoutWrapper: {
    alignSelf: "stretch",
    height: 30,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  wrapper: {
    flex: 1,
    padding: 10,
    gap: 20,
    alignSelf: "stretch",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "transparent",
    alignSelf: "stretch",
  },
  listContainer: {
    borderRadius: 8,
  },
  list: {
    elevation: 2,
    padding: 10,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
  },
  savedTrainings: {
    gap: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  buttons: {
    alignSelf: "stretch",
    marginBottom: 30,
    gap: 15,
  },
});

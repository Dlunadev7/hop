import { Colors } from "@/constants/Colors";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 32 : 16,
    left: 10,
    right: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    height: 64,
  },
  tabItem: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    position: 'relative',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FF6347",
    position: 'absolute',
    bottom: -19,
    width: '100%',
  },
  focusedText: {
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  indexTabItem: {
    transform: [{ translateY: -30 }],
    backgroundColor: Colors.WHITE,
    width: 70,
    height: 70,
    borderRadius: 100,
  },
});

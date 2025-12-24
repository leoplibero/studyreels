import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function LikeButton({ liked, count = 0, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={[styles.icon, liked && styles.liked]}>{liked ? "❤️" : "🤍"}</Text>
      <View style={{ width: 8 }} />
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  icon: { fontSize: 18, color: "#fff" },
  liked: { color: "#ff5b5b" },
  count: { color: "#fff", fontWeight: "600" }
});

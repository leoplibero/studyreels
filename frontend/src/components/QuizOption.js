import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function QuizOption({ text, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  selected: {
    borderColor: "#00c2a8",
    backgroundColor: "#e8fffa"
  },
  text: { fontSize: 16, color: "#222" },
  textSelected: { color: "#00a18e", fontWeight: "700" }
});

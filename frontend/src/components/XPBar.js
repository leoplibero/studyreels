import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function XPBar({ xp = 0, level = 1 }) {
  const current = Number(xp) % 100;
  const progress = Math.min(1, current / 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nível {level} • {xp} XP</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { color: "#222", marginBottom: 4, fontWeight: "600" },
  barBg: { height: 10, backgroundColor: "#e5e5e5", borderRadius: 8, overflow: "hidden" },
  barFill: { height: 10, backgroundColor: "#00c2a8" }
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import XPBar from "../components/XPBar";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.meta}>{user.email}</Text>
      <Text style={styles.meta}>Papel: {user.role}</Text>
      <View style={{ width: "100%", marginTop: 16 }}>
        <XPBar xp={user.xp} level={user.level} />
      </View>
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 4, color: "#00a18e" },
  meta: { color: "#444", marginBottom: 4 },
  logout: {
    marginTop: 24,
    backgroundColor: "#c0392b",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10
  },
  logoutText: { color: "#fff", fontWeight: "700" }
});

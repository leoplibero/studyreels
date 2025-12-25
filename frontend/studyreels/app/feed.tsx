import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function FeedScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Feed!</Text>
      <Text style={styles.subtitle}>Olá, {user?.name}! 👋</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#19C6D1",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

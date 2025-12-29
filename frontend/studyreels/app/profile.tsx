import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="#19C6D1" />
        </View>
      </View>

      {/* User Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
        
        <View style={[styles.infoRow, styles.borderTop]}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={[styles.infoRow, styles.borderTop]}>
          <Text style={styles.label}>ID do Usuário</Text>
          <Text style={[styles.value, styles.userId]}>{user?.id}</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color="#19C6D1" />
            <Text style={styles.settingText}>Notificações</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="settings" size={24} color="#19C6D1" />
            <Text style={styles.settingText}>Preferências</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={24} color="#19C6D1" />
            <Text style={styles.settingText}>Ajuda & Suporte</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="document-text" size={24} color="#19C6D1" />
            <Text style={styles.settingText}>Termos de Serviço</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Versão do App</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>

        <View style={[styles.aboutItem, styles.borderTop]}>
          <Text style={styles.aboutLabel}>Desenvolvido por</Text>
          <Text style={styles.aboutValue}>StudyReels Team</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e8f7f8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#19C6D1",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  label: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  userId: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  aboutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aboutLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  aboutValue: {
    fontSize: 14,
    color: "#19C6D1",
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 0,
    gap: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  spacer: {
    height: 20,
  },
});

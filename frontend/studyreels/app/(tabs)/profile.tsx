import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../../services/api";

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  xp?: number;
  level?: number;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        router.replace("/login");
        return;
      }

      const userData = await getMe(token);
      setUser(userData);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userId");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#19C6D1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
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
          <Text style={styles.value}>{user?.name || "Carregando..."}</Text>
        </View>
        
        <View style={[styles.infoRow, styles.borderTop]}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || "Carregando..."}</Text>
        </View>
        
        {user?.level !== undefined && (
          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.label}>Nível</Text>
            <Text style={styles.value}>{user.level}</Text>
          </View>
        )}
        
        {user?.xp !== undefined && (
          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.label}>XP</Text>
            <Text style={styles.value}>{user.xp}</Text>
          </View>
        )}
      </View>

      {/* XP Progress Bar */}
      {user?.xp !== undefined && user?.level !== undefined && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progresso até o Nível {user.level + 1}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${((user.xp % 200) / 200) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {user.xp % 200} / 200 XP ({Math.floor(((user.xp % 200) / 200) * 100)}%)
          </Text>
        </View>
      )}

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estatísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.statValue}>{user?.level || 0}</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={32} color="#19C6D1" />
            <Text style={styles.statValue}>{user?.xp || 0}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{Math.floor((user?.xp || 0) / 50)}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 0 }}>
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
          <Text style={styles.aboutValue}>Leonardo Paciencia</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 3,
    borderBottomColor: "#ffffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#19C6D1",
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
    fontSize: 10,
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
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#19C6D1",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#19C6D1",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
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

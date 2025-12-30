import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { getRanking, RankingUser } from "../../services/api";

export default function RankingScreen() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    loadRanking();
  }, [])
);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const response = await getRanking();
      setUsers(response.users);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar ranking");
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position: number): string => {
    switch (position) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "⭐";
    }
  };

  const renderRankingItem = ({ item, index }: { item: RankingUser; index: number }) => (
    <View style={[styles.rankingCard, index < 3 && styles.rankingCardTop]}>
      <View style={styles.rankingLeft}>
        <Text style={styles.medal}>{getMedalEmoji(index)}</Text>
        <View style={styles.rankingInfo}>
          <Text style={styles.position}>#{index + 1}</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>

      <View style={styles.rankingRight}>
        <Text style={styles.xp}>{item.xp}</Text>
        <Text style={styles.xpLabel}>XP</Text>
        <Text style={styles.level}>Nível {item.level}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#19C6D1" />
        <Text style={styles.loadingText}>Carregando ranking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ranking</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderRankingItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        scrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#19C6D1",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  rankingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  rankingCardTop: {
    backgroundColor: "#fef9e7",
    borderColor: "#f0d000",
    borderWidth: 2,
  },
  rankingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  medal: {
    fontSize: 28,
  },
  rankingInfo: {
    flex: 1,
  },
  position: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: "#999",
  },
  rankingRight: {
    alignItems: "center",
  },
  xp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#19C6D1",
    marginBottom: 2,
  },
  xpLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  level: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
  },
});

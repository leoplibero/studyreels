import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { getRanking, RankingUser } from "../services/api";

export default function RankingScreen() {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

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
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
      </View>

      <View style={styles.rankingRight}>
        <Text style={styles.points}>{item.points}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
        <Text style={styles.quizzes}>{item.quizzesCompleted} quizzes</Text>
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏆 Ranking</Text>
        <View style={{ width: 80 }} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backArrow: {
    fontSize: 16,
    color: "#19C6D1",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
  points: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#19C6D1",
    marginBottom: 2,
  },
  pointsLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  quizzes: {
    fontSize: 11,
    color: "#999",
    fontStyle: "italic",
  },
});

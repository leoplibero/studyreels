import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { fetchRanking } from "../services/rankingService";

export default function RankingScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchRanking(20);
      if (res.success) setData(res.data || []);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar o ranking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.pos}>{item.position}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>Nível {item.level} • {item.xp} XP</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Ranking vazio</Text>}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  pos: { width: 32, fontWeight: "800", color: "#00a18e" },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  meta: { color: "#555", marginTop: 2 },
  empty: { textAlign: "center", marginTop: 24, color: "#666" }
});

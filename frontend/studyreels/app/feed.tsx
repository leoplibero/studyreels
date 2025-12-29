import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { getFeed, likeVideo, Video } from "../services/api";

export default function FeedScreen() {
  const { token } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await getFeed(page, 10);
      setVideos(response.items);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar feed");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    if (!token) return;

    try {
      await likeVideo(videoId, token);
      
      if (likedVideos.has(videoId)) {
        likedVideos.delete(videoId);
      } else {
        likedVideos.add(videoId);
      }
      setLikedVideos(new Set(likedVideos));
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao curtir vídeo");
    }
  };

  const handleWatchVideo = (videoId: string) => {
    router.push(`/quiz/${videoId}`);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={styles.videoCard}>
      <View style={styles.videoHeader}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoTeacher}>{item.teacher.name}</Text>
      </View>

      <Text style={styles.videoDescription} numberOfLines={2}>{item.description}</Text>

      <View style={styles.videoFooter}>
        <TouchableOpacity
          style={[styles.likeButton, likedVideos.has(item._id) && styles.likeButtonActive]}
          onPress={() => handleLike(item._id)}
        >
          <Text style={styles.likeButtonText}>❤️ {item.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => handleWatchVideo(item._id)}
        >
          <Text style={styles.watchButtonText}>Assistir & Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#19C6D1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed de Vídeos</Text>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.5}
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
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
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
    paddingVertical: 12,
  },
  videoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  videoHeader: {
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  videoTeacher: {
    fontSize: 13,
    color: "#19C6D1",
    fontWeight: "600",
  },
  videoDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  videoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  likeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  likeButtonActive: {
    backgroundColor: "#ffe0e0",
    borderColor: "#ff6b6b",
  },
  likeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  watchButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#19C6D1",
    borderRadius: 8,
    alignItems: "center",
  },
  watchButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});

import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { getFeed, Video } from "../../services/api";

type VideoWithLocalLikes = Video & { localLikes: number };

export default function FeedScreen() {
  const [videos, setVideos] = useState<VideoWithLocalLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await getFeed(page, 10, "", true);
      setVideos(response.items.map((item) => ({
        ...item,
        localLikes: item.likes?.length ?? 0,
      })));
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar feed");
    } finally {
      setLoading(false);
    }
  };

  const handleWatchVideo = (videoId: string) => {
    router.push(`/quiz/${videoId}`);
  };

  const handleLocalLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((video) =>
        video._id === videoId
          ? { ...video, localLikes: (video.localLikes ?? 0) + 1 }
          : video
      )
    );
  };

  const getThumbnailUrl = (video: VideoWithLocalLikes) => {
    if (video.thumbnailUrl) return video.thumbnailUrl;
    const match = video.videoUrl?.match(/(?:v=|youtu.be\/)([A-Za-z0-9_-]{6,})/);
    if (match?.[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return "";
  };

  const renderVideoItem = ({ item }: { item: VideoWithLocalLikes }) => (
    <View style={styles.videoCard}>
      {getThumbnailUrl(item) ? (
        <Image
          source={{ uri: getThumbnailUrl(item) }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.videoHeader}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.videoMetaRow}>
          <Text style={styles.videoTeacher}>{item.teacher.name}</Text>
          <View style={[styles.quizBadge, item.quiz ? styles.quizBadgeActive : styles.quizBadgeInactive]}>
            <Text style={[styles.quizBadgeText, item.quiz ? styles.quizBadgeTextActive : styles.quizBadgeTextInactive]}>
              {item.quiz ? "Quiz disponível" : "Sem quiz"}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.videoDescription} numberOfLines={2}>{item.description}</Text>

      <View style={styles.videoFooter}>
        <TouchableOpacity
          style={styles.likesContainer}
          onPress={() => handleLocalLike(item._id)}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/images/like.png")}
            style={styles.likeIcon}
            resizeMode="contain"
          />
          <Text style={styles.likesText}>{item.localLikes} curtidas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => handleWatchVideo(item._id)}
        >
          <Image
            source={require("../../assets/images/quiz.png")}
            style={styles.quizIcon}
            resizeMode="contain"
          />
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
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#eaeaea",
  },
  videoHeader: {
    marginBottom: 12,
  },
  videoMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
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
  quizBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  quizBadgeActive: {
    backgroundColor: "#e8f7f8",
    borderColor: "#19C6D1",
  },
  quizBadgeInactive: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
  },
  quizBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  quizBadgeTextActive: {
    color: "#19C6D1",
  },
  quizBadgeTextInactive: {
    color: "#999",
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
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likeIcon: {
    width: 20,
    height: 20,
  },
  likesText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
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
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#19C6D1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quizIcon: {
    width: 18,
    height: 18,
  },
  watchButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});

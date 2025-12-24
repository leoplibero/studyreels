import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Alert
} from "react-native";
import VideoPlayer from "../components/VideoPlayer";
import LikeButton from "../components/LikeButton";
import XPBar from "../components/XPBar";
import { fetchVideos, likeVideo } from "../services/videoService";
import { useAuth } from "../context/AuthContext";

const { height } = Dimensions.get("window");

export default function FeedScreen({ navigation }) {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchVideos({ page: 1, limit: 10 });
      if (res.success) setVideos(res.data.items || []);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar o feed");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleLike = async (videoId) => {
    try {
      const res = await likeVideo(videoId);
      if (res.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId
              ? {
                  ...v,
                  likes: res.data.liked
                    ? [...(v.likes || []), user?.id]
                    : (v.likes || []).filter((id) => String(id) !== String(user?.id))
                }
              : v
          )
        );
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível curtir");
    }
  };

  const renderItem = ({ item, index }) => {
    const liked = (item.likes || []).some((id) => String(id) === String(user?.id));
    return (
      <View style={[styles.card, { height }]}> 
        <VideoPlayer source={item.videoUrl} paused={index !== currentIndex} />
        <View style={styles.overlay}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.teacher}>Professor: {item.teacher?.name || ""}</Text>
          <XPBar xp={user?.xp || 0} level={user?.level || 1} />
          <View style={styles.actions}>
            <LikeButton liked={liked} count={(item.likes || []).length} onPress={() => handleLike(item._id)} />
            <TouchableOpacity
              style={styles.quizButton}
              onPress={() => navigation.navigate("Quiz", { videoId: item._id })}
            >
              <Text style={styles.quizText}>Responder Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={!loading && <Text style={styles.empty}>Nenhum vídeo encontrado</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", backgroundColor: "#000" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.35)"
  },
  subject: { color: "#fff", fontWeight: "700", marginBottom: 4 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 4 },
  teacher: { color: "#eaeaea", marginBottom: 8 },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  quizButton: {
    backgroundColor: "#00c2a8",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12
  },
  quizText: { color: "#fff", fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 40, color: "#555" }
});

import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Video } from "expo-av";

export default function VideoPlayer({ source, paused, onEnd }) {
  const playerRef = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={playerRef}
        source={{ uri: source }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={!paused}
        isLooping
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish && onEnd) onEnd();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", aspectRatio: 9 / 16, backgroundColor: "#000" },
  video: { width: "100%", height: "100%" }
});

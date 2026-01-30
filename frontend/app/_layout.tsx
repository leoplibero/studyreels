import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const inAuthGroup = segments[0] === "(tabs)";

      if (!token && inAuthGroup) {
        router.replace("/login");
      } else if (token && !inAuthGroup && segments[0] !== "quiz") {
        router.replace("/(tabs)/feed");
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="quiz/[id]" />
    </Stack>
  );
}

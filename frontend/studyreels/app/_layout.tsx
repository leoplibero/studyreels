import { Stack, Tabs } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#19C6D1" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="cadastro" 
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopWidth: 0,
          paddingVertical: 10,
          paddingBottom: 12,
          height: 70,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: focused ? "#00BCD4" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="play-circle"
                size={28}
                color={focused ? "#fff" : "#888"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: focused ? "#9C27B0" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="trophy"
                size={28}
                color={focused ? "#fff" : "#888"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: focused ? "#FF6B6B" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="account-circle"
                size={28}
                color={focused ? "#fff" : "#888"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Group
        screenOptions={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="quiz/[id]" />
      </Tabs.Group>
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

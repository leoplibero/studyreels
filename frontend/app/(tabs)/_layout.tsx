import { Tabs } from "expo-router";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../../services/api";

export default function TabsLayout() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const userData = await getMe(token);
        setUserRole(userData.role);
      }
    } catch (error) {
      console.error("Erro ao carregar role do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTeacherOrAdmin = userRole == "teacher" || userRole == "admin"

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
        name="manage"
        options={{
          title: "Gerenciar",
          href: isTeacherOrAdmin ? "/manage" : null,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: focused ? "#4CAF50" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="school"
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
    </Tabs>
  );
}

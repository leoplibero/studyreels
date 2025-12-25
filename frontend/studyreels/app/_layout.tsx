import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

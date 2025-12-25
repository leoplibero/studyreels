import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
      // Navegar para a tela principal após login bem-sucedido
      router.replace("/feed");
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message || "Falha ao fazer login");
    }
  };
  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Avatar */}
      <Image
        source={require("../assets/images/user.png")}
        style={styles.avatar}
        resizeMode="contain"
      />

      {/* Inputs */}
      <TextInput
        placeholder="email"
        style={styles.input}
        placeholderTextColor="#7BBFD9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        placeholder="senha"
        style={styles.input}
        placeholderTextColor="#7BBFD9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      {/* Botão */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Entrando..." : "Login"}</Text>
      </TouchableOpacity>

      {/* Cadastro */}
      <Text style={styles.footerText}>
        Não possui conta? <Text style={styles.link} onPress={() => router.push("/cadastro")}>Cadastre-se</Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 0,
    marginBottom: -80
  },
  avatar: {
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: 0
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#7BBFD9",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    color: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#7BBFD9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#333",
  },
  link: {
    color: "#7BBFD9",
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});


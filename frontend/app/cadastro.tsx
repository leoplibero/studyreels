import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser } from "../services/api";

export default function Cadastro() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({ name, email, password, confirmPassword });
      
      await AsyncStorage.setItem("authToken", response.token);
      await AsyncStorage.setItem("userId", response.data.id);
      
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.replace("/feed");
    } catch (error: any) {
      Alert.alert("Erro no Cadastro", error.message || "Falha ao registrar");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput 
        placeholder="nome completo" 
        style={styles.input}
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput 
        placeholder="email" 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput 
        placeholder="senha" 
        style={styles.input} 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <TextInput 
        placeholder="confirmar senha" 
        style={styles.input} 
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Já tem conta?{" "}
        <Text style={styles.link} onPress={() => router.push("/login")}>
          Login
        </Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 220,
    height: 80,
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#8FE3EA",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#19C6D1",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: "#555",
  },
  link: {
    color: "#19C6D1",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await register({ name, email, password, role });
    } catch (err) {
      Alert.alert("Erro", err.message || "Falha ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = () => setRole((prev) => (prev === "student" ? "teacher" : "student"));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.roleButton} onPress={toggleRole}>
        <Text style={styles.roleText}>Papel: {role === "student" ? "Aluno" : "Professor"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Enviando..." : "Cadastrar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f7f7f7" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20, textAlign: "center", color: "#00a18e" },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12
  },
  roleButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#e8fffa",
    borderWidth: 1,
    borderColor: "#00c2a8",
    marginBottom: 12
  },
  roleText: { color: "#007f6b", fontWeight: "700", textAlign: "center" },
  button: {
    backgroundColor: "#00c2a8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 }
});

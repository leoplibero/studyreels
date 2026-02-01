import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createVideo } from "../../services/api";

export default function ManageScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Quiz form states
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState(0);
  const [quizXpReward, setQuizXpReward] = useState("50");

  const handleCreateVideo = async () => {
    try {
      if (!title.trim() || !videoUrl.trim() || !subject.trim()) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios do vídeo");
        return;
      }

      if (!quizQuestion.trim() || quizOptions.some(opt => !opt.trim())) {
        Alert.alert("Erro", "Preencha a pergunta e todas as opções do quiz");
        return;
      }

      const xpValue = parseInt(quizXpReward);
      if (isNaN(xpValue) || xpValue <= 0) {
        Alert.alert("Erro", "O valor de XP deve ser um número positivo");
        return;
      }

      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        Alert.alert("Erro", "Token não encontrado");
        return;
      }

      const videoData: any = {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        subject: subject.trim(),
      };

      videoData.quiz = {
        question: quizQuestion.trim(),
        options: quizOptions.map(opt => opt.trim()),
        correctAnswer: quizCorrectAnswer,
        xpReward: parseInt(quizXpReward),
      };

      await createVideo(videoData, token);

      Alert.alert("Sucesso", "Vídeo e quiz criados com sucesso!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setSubject("");
      setQuizQuestion("");
      setQuizOptions(["", "", "", ""]);
      setQuizCorrectAnswer(0);
      setQuizXpReward("50");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao adicionar vídeo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Conteúdo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adicionar Novo Vídeo e Quiz</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Introdução ao React Native"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição do conteúdo do vídeo"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL do Vídeo *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Matéria/Assunto *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Matemática, Física, Programação"
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.quizSection}>
            <Text style={styles.sectionTitle}>📝 Dados do Quiz</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pergunta do Quiz *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite a pergunta do quiz"
                value={quizQuestion}
                onChangeText={setQuizQuestion}
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            {quizOptions.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              return (
                <View key={index} style={styles.inputGroup}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.label}>Opção {optionLetter} *</Text>
                    <TouchableOpacity
                      style={[
                        styles.correctButton,
                        quizCorrectAnswer === index && styles.correctButtonActive
                      ]}
                      onPress={() => setQuizCorrectAnswer(index)}
                    >
                      <Ionicons
                        name={quizCorrectAnswer === index ? "checkmark-circle" : "checkmark-circle-outline"}
                        size={20}
                        color={quizCorrectAnswer === index ? "#4CAF50" : "#999"}
                      />
                      <Text style={[
                        styles.correctButtonText,
                        quizCorrectAnswer === index && styles.correctButtonTextActive
                      ]}>
                        {quizCorrectAnswer === index ? "Correta" : "Marcar como correta"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={`Digite a opção ${optionLetter}`}
                    value={option}
                    onChangeText={(text) => {
                      const newOptions = [...quizOptions];
                      newOptions[index] = text;
                      setQuizOptions(newOptions);
                    }}
                    placeholderTextColor="#999"
                  />
                </View>
              );
            })}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recompensa de XP *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 50"
                value={quizXpReward}
                onChangeText={setQuizXpReward}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Text style={styles.helperText}>Quantidade de XP que o aluno ganhará ao acertar</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateVideo}
            disabled={loading}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? "Adicionando..." : "Adicionar Vídeo e Quiz"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#19C6D1" />
          <Text style={styles.infoText}>
            Use URLs de vídeos do YouTube, Vimeo ou outras plataformas. O vídeo será incorporado no aplicativo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#19C6D1",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  quizSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f5f0ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9C27B0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: 16,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  correctButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  correctButtonActive: {
    backgroundColor: "#e8f5e9",
  },
  correctButtonText: {
    fontSize: 12,
    color: "#999",
  },
  correctButtonTextActive: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#19C6D1",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e8f7f8",
    borderRadius: 8,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
});

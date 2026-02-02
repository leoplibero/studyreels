import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { getQuizForVideo, answerQuiz, Quiz } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await getQuizForVideo(id as string);
      console.log("Quiz loaded:", JSON.stringify(quizData, null, 2));
      setQuiz(quizData);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsCorrect(null);
      setXpEarned(0);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar quiz");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null || !quiz) return;
    
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado para responder o quiz");
        router.replace("/login");
        return;
      }

      console.log("Submitting answer - Quiz ID:", quiz.id, "Answer index:", selectedAnswer);
      
      const result = await answerQuiz(quiz.id, selectedAnswer, token);
      
      console.log("Answer result:", result);
      
      setAnswered(true);
      setIsCorrect(result.isCorrect);
      setXpEarned(result.xpEarned);
      
      if (result.isCorrect) {
        Alert.alert(
          "Parabéns! 🎉", 
          `Resposta correta! Você ganhou ${result.xpEarned} XP!`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          "Resposta Incorreta ❌",
          `Você escolheu: ${quiz.options[selectedAnswer]}\n\nEstude mais e tente novamente!`,
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao enviar resposta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToFeed = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#19C6D1" />
        <Text style={styles.loadingText}>Carregando quiz...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Quiz não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToFeed}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.quizContainer}>
        <Text style={styles.title}>Quiz</Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.question}>{quiz.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {quiz.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.optionButtonSelected,
                answered && isCorrect && selectedAnswer === index && styles.optionButtonCorrect,
                answered && !isCorrect && selectedAnswer === index && styles.optionButtonWrong,
              ]}
              onPress={() => !answered && setSelectedAnswer(index)}
              disabled={answered}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === index && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {answered && (
          <View style={[styles.resultCard, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultText}>
              {isCorrect ? `✓ Resposta Correta! +${xpEarned} XP` : "✗ Resposta Incorreta"}
            </Text>
            {isCorrect && (
              <Text style={styles.resultDescription}>
                Você ganhou {xpEarned} pontos de experiência!
              </Text>
            )}
          </View>
        )}

        {!answered ? (
          <TouchableOpacity
            style={[styles.submitButton, selectedAnswer === null && styles.submitButtonDisabled]}
            onPress={handleAnswerSubmit}
            disabled={selectedAnswer === null || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "Enviando..." : "Responder"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.backButton} onPress={handleBackToFeed}>
            <Text style={styles.backButtonText}>Voltar ao Feed</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    fontWeight: "bold",
    marginBottom: 20,
  },
  quizContainer: {
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#19C6D1",
    marginBottom: 8,
  },
  questionCard: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#19C6D1",
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  optionButtonSelected: {
    borderColor: "#19C6D1",
    backgroundColor: "#e8f7f8",
  },
  optionButtonCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e9",
  },
  optionButtonWrong: {
    borderColor: "#FF6B6B",
    backgroundColor: "#ffebee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#19C6D1",
  },
  optionTextAnswer: {
    fontWeight: "bold",
  },
  resultCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 8,
  },
  resultCorrect: {
    backgroundColor: "#e8f5e9",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  resultWrong: {
    backgroundColor: "#ffebee",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: "#666",
  },
  submitButton: {
    paddingVertical: 14,
    backgroundColor: "#19C6D1",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 14,
    backgroundColor: "#666",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { getQuizForVideo, Quiz } from "../../services/api";

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await getQuizForVideo(id as string);
      setQuiz(quizData);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsCorrect(null);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar quiz");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !quiz) return;
    
    setAnswered(true);
    setIsCorrect(selectedAnswer === quiz.correctAnswer);
    
    if (selectedAnswer === quiz.correctAnswer) {
      Alert.alert("Parabéns! 🎉", "Resposta correta!");
    } else {
      Alert.alert("Resposta Incorreta", "Tente novamente!");
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
                selectedAnswer === option && styles.optionButtonSelected,
                answered && option === quiz.correctAnswer && styles.optionButtonCorrect,
                answered && selectedAnswer === option && !isCorrect && styles.optionButtonWrong,
              ]}
              onPress={() => !answered && setSelectedAnswer(option)}
              disabled={answered}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === option && styles.optionTextSelected,
                  answered && (option === quiz.correctAnswer || selectedAnswer === option) && styles.optionTextAnswer,
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
              {isCorrect ? "✓ Resposta Correta!" : "✗ Resposta Incorreta"}
            </Text>
            <Text style={styles.resultDescription}>
              A resposta correta é: {quiz.correctAnswer}
            </Text>
          </View>
        )}

        {!answered ? (
          <TouchableOpacity
            style={[styles.submitButton, !selectedAnswer && styles.submitButtonDisabled]}
            onPress={handleAnswerSubmit}
            disabled={!selectedAnswer || submitting}
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

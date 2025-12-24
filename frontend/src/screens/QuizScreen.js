import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { fetchQuizByVideo, answerQuiz } from "../services/quizService";
import QuizOption from "../components/QuizOption";
import { useAuth } from "../context/AuthContext";

export default function QuizScreen({ route }) {
  const { videoId } = route.params;
  const { applyXp } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchQuizByVideo(videoId);
        if (res.success) setQuiz(res.data);
        else Alert.alert("Aviso", res.message || "Quiz não encontrado");
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar o quiz");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [videoId]);

  const handleAnswer = async (idx) => {
    if (!quiz || submitting) return;
    setSelected(idx);
    try {
      setSubmitting(true);
      const res = await answerQuiz(quiz.id, idx);
      if (res.success) {
        setResult(res.data);
        if (res.data.isCorrect) await applyXp(res.data.xpEarned || 0);
      } else {
        Alert.alert("Erro", res.message || "Falha ao responder");
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao responder o quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.center}>
        <Text>Quiz não disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quiz.question}</Text>
      {quiz.options.map((opt, idx) => (
        <QuizOption
          key={idx}
          text={opt}
          selected={selected === idx}
          onPress={() => handleAnswer(idx)}
        />
      ))}
      {result && (
        <Text style={[styles.feedback, result.isCorrect ? styles.correct : styles.wrong]}>
          {result.isCorrect ? `Acertou! +${result.xpEarned} XP` : "Resposta incorreta"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  question: { fontSize: 20, fontWeight: "800", marginBottom: 16, color: "#222" },
  feedback: { marginTop: 16, fontWeight: "800", fontSize: 16 },
  correct: { color: "#00a18e" },
  wrong: { color: "#c0392b" }
});

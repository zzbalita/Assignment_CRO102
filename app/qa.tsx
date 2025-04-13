import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation, UIManager, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { db } from "@/firebaseConfig";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface QA {
  id: string;
  question: string;
  answer: string;
}

export default function QAScreen() {
  const [qaList, setQaList] = useState<QA[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQA = async () => {
      try {
        const q = query(collection(db, "qa"), orderBy("order"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as QA[];
        setQaList(data);
      } catch (err) {
        console.error("Error fetching Q&A:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQA();
  }, []);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Q & A</Text>
      {qaList.map((item, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <Animated.View
            key={item.id}
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={[
              styles.card,
              isExpanded && styles.cardExpanded,
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.questionRow}
              activeOpacity={0.7}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color="#555"
              />
            </TouchableOpacity>
            {isExpanded && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardExpanded: {
    backgroundColor: "#fff",
    shadowOpacity: 0.15,
    elevation: 5,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  answerContainer: {
    marginTop: 10,
  },
  answerText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});

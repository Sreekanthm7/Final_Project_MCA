import React, { useState, useRef, useEffect } from "react"
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { analyzeMood, MoodAnalysis } from "../../services/openai"

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
}

const DAILY_QUESTIONS = [
  "How are you feeling today?",
  "How well did you sleep last night?",
  "Have you eaten your meals today?",
  "Are you experiencing any physical discomfort or pain?",
  "Have you taken your medications today?",
  "Have you been able to connect with family or friends today?",
  "How is your energy level today?",
  "Are you feeling lonely or sad today?",
  "Did you do any activities you enjoy today?",
  "Is there anything particular worrying you right now?",
]

export default function ChatbotScreen() {
  const router = useRouter()
  const flatListRef = useRef<FlatList>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to check in on how you're doing today. I'll ask you 10 simple questions about your well-being. Please answer honestly so I can better understand how you're feeling. 😊",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Ask first question after initial greeting
    setTimeout(() => {
      askNextQuestion()
    }, 1500)
  }, [])

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const askNextQuestion = () => {
    if (questionIndex < DAILY_QUESTIONS.length) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: `Question ${questionIndex + 1}/10: ${DAILY_QUESTIONS[questionIndex]}`,
        sender: "bot",
      }
      setMessages((prev) => [...prev, botMessage])
    } else {
      // All questions answered - analyze mood
      analyzeMoodAndNavigate()
    }
  }

  const analyzeMoodAndNavigate = async () => {
    setIsAnalyzing(true)

    const loadingMessage: Message = {
      id: Date.now().toString(),
      text: "Thank you for sharing! Let me analyze your responses and provide personalized recommendations... 🤔",
      sender: "bot",
    }
    setMessages((prev) => [...prev, loadingMessage])

    try {
      const analysis: MoodAnalysis = await analyzeMood(userAnswers)

      // Save mood data
      await AsyncStorage.setItem("todayMood", analysis.mood)
      await AsyncStorage.setItem("lastCheckIn", new Date().toISOString())
      await AsyncStorage.setItem("moodAnalysis", JSON.stringify(analysis))

      setIsAnalyzing(false)
      setIsComplete(true)

      const resultMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Analysis complete! Let me show you some personalized recommendations based on how you're feeling. 💚",
        sender: "bot",
      }
      setMessages((prev) => [...prev, resultMessage])

      // Navigate to results page after a delay
      setTimeout(() => {
        router.push({
          pathname: "/mood-results",
          params: { analysisData: JSON.stringify(analysis) },
        })
      }, 2000)
    } catch (error) {
      console.error("Error analyzing mood:", error)
      setIsAnalyzing(false)

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I had some trouble analyzing your responses. Please try again later or check your internet connection.",
        sender: "bot",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const sendMessage = () => {
    if (input.trim() === "" || isComplete) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])

    // Save answer
    const newAnswers = [...userAnswers, input]
    setUserAnswers(newAnswers)

    setInput("")

    // Move to next question
    setQuestionIndex((prev) => prev + 1)

    // Ask next question after delay
    setTimeout(() => {
      askNextQuestion()
    }, 800)
  }

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user" ? styles.userText : styles.botText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>Daily Check-In</Text>
            <Text style={styles.headerSubtext}>
              {questionIndex}/{DAILY_QUESTIONS.length} questions
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {!isComplete && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your answer here..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              editable={!isAnalyzing}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || isAnalyzing) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="send" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#667eea",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    color: "#333",
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
})

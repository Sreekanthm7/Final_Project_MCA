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

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
}

interface DailyQuestion {
  _id: string
  questionText: string
  category: string
}

interface QuestionWithCategory {
  text: string
  category: string
}

const FALLBACK_QUESTIONS: QuestionWithCategory[] = [
  { text: "How are you feeling today?", category: "emotional" },
  { text: "How well did you sleep last night?", category: "sleep" },
  { text: "Have you eaten your meals today?", category: "daily-living" },
  { text: "Are you experiencing any physical discomfort or pain?", category: "physical" },
  { text: "Is there anything particular worrying you right now?", category: "anxiety" },
]

export default function ChatbotScreen() {
  const router = useRouter()
  const flatListRef = useRef<FlatList>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [dailyQuestions, setDailyQuestions] = useState<QuestionWithCategory[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [displayIndex, setDisplayIndex] = useState(0)

  // Use refs for mutable tracking to avoid stale closure issues in setTimeout
  const questionsRef = useRef<QuestionWithCategory[]>([])
  const answersRef = useRef<string[]>([])
  const questionIndexRef = useRef(0)

  useEffect(() => {
    fetchDailyQuestions()
  }, [])

  const fetchDailyQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${API_URL}/questions/daily`)
      const data = await response.json()

      let questions: QuestionWithCategory[]

      if (response.ok && data.success && data.data?.questions?.length > 0) {
        questions = data.data.questions.map((q: DailyQuestion) => ({
          text: q.questionText,
          category: q.category,
        }))
      } else {
        questions = FALLBACK_QUESTIONS
      }

      setDailyQuestions(questions)
      questionsRef.current = questions
      setIsLoadingQuestions(false)

      // Show greeting then ask first question
      setMessages([
        {
          id: "1",
          text: `Hello! I'm here to check in on how you're doing today. I'll ask you ${questions.length} simple questions about your well-being. Please answer honestly so I can better understand how you're feeling.`,
          sender: "bot",
        },
      ])

      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: `Question 1/${questions.length}: ${questions[0].text}`,
          sender: "bot",
        }
        setMessages((prev) => [...prev, botMessage])
      }, 1500)
    } catch (error) {
      console.error("Error fetching daily questions:", error)
      const questions = FALLBACK_QUESTIONS
      setDailyQuestions(questions)
      questionsRef.current = questions
      setIsLoadingQuestions(false)

      setMessages([
        {
          id: "1",
          text: `Hello! I'm here to check in on how you're doing today. I'll ask you ${questions.length} simple questions about your well-being. Please answer honestly so I can better understand how you're feeling.`,
          sender: "bot",
        },
      ])

      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: `Question 1/${questions.length}: ${questions[0].text}`,
          sender: "bot",
        }
        setMessages((prev) => [...prev, botMessage])
      }, 1500)
    }
  }

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const saveResponsesAndFinish = async (collectedAnswers: string[]) => {
    setIsAnalyzing(true)

    const savingMessage: Message = {
      id: Date.now().toString(),
      text: "Thank you for sharing! I'm analyzing your responses now...",
      sender: "bot",
    }
    setMessages((prev) => [...prev, savingMessage])

    // Build question-answer pairs using the passed-in answers (not stale state)
    const questions = questionsRef.current
    const questionAnswers = questions.map((q, i) => ({
      question: q.text,
      answer: collectedAnswers[i] || "",
      category: q.category,
    }))

    console.log("[Chatbot] Sending answers for analysis:", JSON.stringify(questionAnswers))

    try {
      const token = await AsyncStorage.getItem("authToken")
      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"

      // Call the AI mood analysis endpoint
      const res = await fetch(`${API_URL}/mood/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questionAnswers }),
      })

      const data = await res.json()
      console.log("[Chatbot] Analysis response:", JSON.stringify(data))

      await AsyncStorage.setItem("lastCheckIn", new Date().toISOString())

      setIsAnalyzing(false)
      setIsComplete(true)

      if (res.ok && data.success) {
        const moodResult = data.data

        // Show empathetic message based on mood
        let empathyText = ""
        if (moodResult.mood === "Highly Depressed" || moodResult.mood === "Depressed") {
          empathyText =
            "I can sense you're going through a tough time. Please know that you're not alone, and there are people who care about you deeply. Let me guide you to some activities that might help."
        } else if (moodResult.mood === "Stressed") {
          empathyText =
            "It sounds like you have some things on your mind. That's completely normal. Let me show you your results and suggest some relaxing activities."
        } else {
          empathyText =
            "Wonderful! You seem to be doing well today. Let's keep that positive energy going!"
        }

        const doneMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: empathyText,
          sender: "bot",
        }
        setMessages((prev) => [...prev, doneMessage])

        // Navigate to mood results screen after a brief pause
        setTimeout(() => {
          router.replace({
            pathname: "/mood-results",
            params: {
              analysisData: JSON.stringify({
                mood: moodResult.mood,
                confidence: moodResult.confidence,
                emotionsDetected: moodResult.emotionsDetected,
                reason: moodResult.reason,
                analysisSource: moodResult.analysisSource,
              }),
            },
          })
        }, 3000)
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "There was an issue analyzing your responses, but don't worry. Your answers have been recorded. Please try again later.",
          sender: "bot",
        }
        setMessages((prev) => [...prev, errorMsg])

        setTimeout(() => {
          router.replace("/(tabs)")
        }, 2500)
      }
    } catch (error) {
      console.error("Error analyzing responses:", error)
      setIsAnalyzing(false)
      setIsComplete(true)

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Failed to analyze responses. Please check your connection and try again.",
        sender: "bot",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const sendMessage = () => {
    if (input.trim() === "" || isComplete) return

    const currentAnswer = input.trim()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentAnswer,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])

    // Save answer to ref immediately (no stale closure issue)
    answersRef.current = [...answersRef.current, currentAnswer]
    const nextIndex = questionIndexRef.current + 1
    questionIndexRef.current = nextIndex

    // Update display state
    setDisplayIndex(nextIndex)

    setInput("")

    const questions = questionsRef.current

    // Check if all questions have been answered
    if (nextIndex >= questions.length) {
      // All questions answered - start analysis with the collected answers
      const allAnswers = [...answersRef.current]
      setTimeout(() => {
        saveResponsesAndFinish(allAnswers)
      }, 800)
    } else {
      // Ask next question after delay
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: `Question ${nextIndex + 1}/${questions.length}: ${questions[nextIndex].text}`,
          sender: "bot",
        }
        setMessages((prev) => [...prev, botMessage])
      }, 800)
    }
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

  if (isLoadingQuestions) {
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
            </View>
            <View style={{ width: 28 }} />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>
            Preparing today's questions...
          </Text>
        </View>
      </View>
    )
  }

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
              {displayIndex}/{dailyQuestions.length} questions
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
})

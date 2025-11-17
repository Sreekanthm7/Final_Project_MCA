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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface ChatMessage {
  id: string
  userName: string
  message: string
  timestamp: string
  userId: string
}

// Mock messages for demonstration
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    userName: "Mary",
    message: "Good morning everyone! How is everyone doing today?",
    timestamp: "9:30 AM",
    userId: "user1",
  },
  {
    id: "2",
    userName: "John",
    message: "Morning Mary! Feeling great today. Just finished my morning walk!",
    timestamp: "9:35 AM",
    userId: "user2",
  },
  {
    id: "3",
    userName: "Sarah",
    message: "Hello friends! The weather is beautiful today.",
    timestamp: "9:42 AM",
    userId: "user3",
  },
  {
    id: "4",
    userName: "Robert",
    message: "Anyone interested in joining a virtual book club?",
    timestamp: "10:15 AM",
    userId: "user4",
  },
]

export default function CommunityScreen() {
  const flatListRef = useRef<FlatList>(null)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [onlineCount] = useState(12)

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const sendMessage = () => {
    if (input.trim() === "") return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userName: "You",
      message: input,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      userId: "currentUser",
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.userId === "currentUser"

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser && styles.currentUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          {!isCurrentUser && (
            <Text style={styles.userName}>{item.userName}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isCurrentUser && styles.currentUserText,
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isCurrentUser && styles.currentUserTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>

        {isCurrentUser && (
          <View style={[styles.avatarCircle, styles.currentUserAvatar]}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f093fb", "#f5576c"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Community Chat</Text>
        <View style={styles.onlineStatus}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>{onlineCount} members online</Text>
        </View>
      </LinearGradient>

      <View style={styles.welcomeBanner}>
        <Ionicons name="people" size={24} color="#f5576c" />
        <Text style={styles.welcomeText}>
          Connect with friends and share your thoughts!
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <LinearGradient
              colors={input.trim() ? ["#f093fb", "#f5576c"] : ["#ccc", "#ccc"]}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#43e97b",
    marginRight: 8,
  },
  onlineText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  welcomeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
  },
  chatContainer: {
    flex: 1,
    marginTop: 15,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
  },
  currentUserMessage: {
    justifyContent: "flex-end",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  currentUserAvatar: {
    backgroundColor: "#f5576c",
    marginRight: 0,
    marginLeft: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "70%",
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  otherUserBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currentUserBubble: {
    backgroundColor: "#667eea",
    borderBottomRightRadius: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f5576c",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  currentUserText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: "rgba(255, 255, 255, 0.8)",
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
    borderRadius: 25,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
})

import React, { useState, useRef, useEffect, useCallback } from "react"
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
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface ChatMessage {
  _id: string
  text: string
  senderId: string
  senderName: string
  createdAt: string
}

const POLL_INTERVAL = 4000 // Poll every 4 seconds

export default function CommunityScreen() {
  const flatListRef = useRef<FlatList>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastFetchTimeRef = useRef<string | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [currentUserName, setCurrentUserName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)

  const getApiUrl = () =>
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("authToken")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  // Load current user info
  useEffect(() => {
    const loadUser = async () => {
      const userId = await AsyncStorage.getItem("userId")
      const storedUser = await AsyncStorage.getItem("currentUser")
      if (userId) setCurrentUserId(userId)
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setCurrentUserName(user.name || "")
        } catch {}
      }
    }
    loadUser()
  }, [])

  // Fetch all messages on mount
  const fetchAllMessages = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${getApiUrl()}/chat/messages`, { headers })
      const data = await response.json()

      if (response.ok && data.success) {
        setMessages(data.data.messages)
        if (data.data.messages.length > 0) {
          lastFetchTimeRef.current =
            data.data.messages[data.data.messages.length - 1].createdAt
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Poll for new messages
  const pollNewMessages = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const sinceParam = lastFetchTimeRef.current
        ? `?since=${encodeURIComponent(lastFetchTimeRef.current)}`
        : ""
      const response = await fetch(
        `${getApiUrl()}/chat/messages${sinceParam}`,
        { headers }
      )
      const data = await response.json()

      if (response.ok && data.success && data.data.messages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id))
          const newMsgs = data.data.messages.filter(
            (m: ChatMessage) => !existingIds.has(m._id)
          )
          if (newMsgs.length === 0) return prev
          return [...prev, ...newMsgs]
        })
        lastFetchTimeRef.current =
          data.data.messages[data.data.messages.length - 1].createdAt
      }
    } catch (error) {
      // Silent fail for polling
    }
  }, [])

  // Fetch online count
  const fetchOnlineCount = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${getApiUrl()}/chat/online-count`, {
        headers,
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setOnlineCount(data.data.onlineCount)
      }
    } catch {}
  }, [])

  // Initial fetch + start polling
  useEffect(() => {
    fetchAllMessages()
    fetchOnlineCount()

    pollTimerRef.current = setInterval(() => {
      pollNewMessages()
      fetchOnlineCount()
    }, POLL_INTERVAL)

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 150)
  }, [messages])

  const sendMessage = async () => {
    if (input.trim() === "" || isSending) return

    const messageText = input.trim()
    setInput("")
    setIsSending(true)

    // Optimistic update
    const optimisticMsg: ChatMessage = {
      _id: `temp_${Date.now()}`,
      text: messageText,
      senderId: currentUserId,
      senderName: currentUserName,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticMsg])

    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${getApiUrl()}/chat/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ text: messageText }),
      })
      const data = await response.json()

      if (response.ok && data.success) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) =>
            m._id === optimisticMsg._id ? data.data.message : m
          )
        )
        lastFetchTimeRef.current = data.data.message.createdAt
      } else {
        // Remove optimistic message on failure
        setMessages((prev) =>
          prev.filter((m) => m._id !== optimisticMsg._id)
        )
        Alert.alert("Error", data.message || "Failed to send message")
      }
    } catch (error) {
      setMessages((prev) =>
        prev.filter((m) => m._id !== optimisticMsg._id)
      )
      Alert.alert("Error", "Failed to send message. Check your connection.")
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.senderId === currentUserId

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
              {item.senderName.charAt(0).toUpperCase()}
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
            <Text style={styles.userName}>{item.senderName}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isCurrentUser && styles.currentUserText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isCurrentUser && styles.currentUserTimestamp,
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>

        {isCurrentUser && (
          <View style={[styles.avatarCircle, styles.currentUserAvatar]}>
            <Text style={styles.avatarText}>
              {currentUserName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#f093fb", "#f5576c"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Community Chat</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f5576c" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
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
          <Text style={styles.onlineText}>
            {onlineCount} {onlineCount === 1 ? "member" : "members"} online
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.welcomeBanner}>
        <Ionicons name="people" size={24} color="#f5576c" />
        <Text style={styles.welcomeText}>
          Connect with fellow members and share your thoughts!
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

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
            style={[
              styles.sendButton,
              (!input.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isSending}
          >
            <LinearGradient
              colors={
                input.trim() && !isSending
                  ? ["#f093fb", "#f5576c"]
                  : ["#ccc", "#ccc"]
              }
              style={styles.sendButtonGradient}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={24} color="#fff" />
              )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
})

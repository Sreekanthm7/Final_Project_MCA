import React, { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

interface MusicTrack {
  id: string
  title: string
  category: string
  duration: string
  icon: any
}

const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "1",
    title: "Peaceful Piano",
    category: "Classical",
    duration: "15:00",
    icon: "musical-note",
  },
  {
    id: "2",
    title: "Ocean Waves",
    category: "Nature Sounds",
    duration: "20:00",
    icon: "water",
  },
  {
    id: "3",
    title: "Morning Birds",
    category: "Nature Sounds",
    duration: "12:00",
    icon: "leaf",
  },
  {
    id: "4",
    title: "Gentle Guitar",
    category: "Acoustic",
    duration: "18:00",
    icon: "musical-notes",
  },
  {
    id: "5",
    title: "Rain Sounds",
    category: "Nature Sounds",
    duration: "25:00",
    icon: "rainy",
  },
  {
    id: "6",
    title: "Soft Jazz",
    category: "Jazz",
    duration: "22:00",
    icon: "musical-note",
  },
]

export default function MusicTherapyScreen() {
  const router = useRouter()
  const [playing, setPlaying] = useState<string | null>(null)

  const togglePlay = (trackId: string) => {
    if (playing === trackId) {
      setPlaying(null)
    } else {
      setPlaying(trackId)
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#43e97b", "#38f9d7"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Music Therapy</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.headerInfo}>
          <Ionicons name="musical-notes" size={60} color="#fff" />
          <Text style={styles.headerDescription}>
            Relax and unwind with soothing music
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#43e97b" />
          <Text style={styles.infoText}>
            Music therapy can help reduce stress, anxiety, and improve your
            mood. Choose a track and relax.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Tracks</Text>

        {MUSIC_TRACKS.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackCard}
            onPress={() => togglePlay(track.id)}
          >
            <View
              style={[
                styles.trackIcon,
                playing === track.id && styles.trackIconPlaying,
              ]}
            >
              <Ionicons
                name={track.icon}
                size={28}
                color={playing === track.id ? "#fff" : "#43e97b"}
              />
            </View>

            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <View style={styles.trackMeta}>
                <Text style={styles.trackCategory}>{track.category}</Text>
                <Text style={styles.trackDuration}>• {track.duration}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => togglePlay(track.id)}
            >
              <LinearGradient
                colors={
                  playing === track.id
                    ? ["#f5576c", "#f093fb"]
                    : ["#43e97b", "#38f9d7"]
                }
                style={styles.playButtonGradient}
              >
                <Ionicons
                  name={playing === track.id ? "pause" : "play"}
                  size={24}
                  color="#fff"
                />
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Listening Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#43e97b" />
            <Text style={styles.tipText}>
              Find a comfortable, quiet place
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#43e97b" />
            <Text style={styles.tipText}>Close your eyes and breathe deeply</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#43e97b" />
            <Text style={styles.tipText}>
              Listen for at least 10-15 minutes
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 15,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e7f9f0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trackIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e7f9f0",
    alignItems: "center",
    justifyContent: "center",
  },
  trackIconPlaying: {
    backgroundColor: "#43e97b",
  },
  trackInfo: {
    flex: 1,
    marginLeft: 15,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  trackMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackCategory: {
    fontSize: 14,
    color: "#666",
  },
  trackDuration: {
    fontSize: 14,
    color: "#999",
    marginLeft: 5,
  },
  playButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  playButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  tipsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#666",
  },
})

import React, { useEffect, useState } from "react"
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
import { Audio } from "expo-av"

interface MusicTrack {
  id: string
  title: string
  file: any
  icon: any
  category: string
  duration: string
}

const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "1",
    title: "Sport rock trailer",
    file: require("./assets/music/alexgrohl.mp3"),
    icon: "musical-note",
    category: "Focus",
    duration: "3:20",
  },
  {
    id: "2",
    title: "Motivation",
    file: require("./assets/music/the_mountain-motivation.mp3"),
    icon: "water",
    category: "Energy",
    duration: "2:50",
  },
  {
    id: "3",
    title: "Piano motivation",
    file: require("./assets/music/atlasaudi.mp3"),
    icon: "leaf",
    category: "Relax",
    duration: "4:10",
  },
  {
    id: "4",
    title: "Paul Motivation",
    file: require("./assets/music/paulyudin.mp3"),
    icon: "musical-notes",
    category: "Focus",
    duration: "3:45",
  },
  {
    id: "5",
    title: "Pretty Motivation",
    file: require("./assets/music/prettyjohn.mp3"),
    icon: "rainy",
    category: "Calm",
    duration: "3:00",
  },
]

export default function MusicTherapyScreen() {
  const router = useRouter()
  const [playing, setPlaying] = useState<string | null>(null)
  const [sound, setSound] = useState<Audio.Sound | null>(null)

  // 🧹 Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

  // ▶️ Play / Pause logic
  const togglePlay = async (track: MusicTrack) => {
    try {
      // If same track → pause
      if (playing === track.id && sound) {
        await sound.pauseAsync()
        setPlaying(null)
        return
      }

      // Stop previous track
      if (sound) {
        await sound.unloadAsync()
      }

      // Load new track
      const { sound: newSound } = await Audio.Sound.createAsync(track.file)

      setSound(newSound)
      await newSound.playAsync()
      setPlaying(track.id)
    } catch (error) {
      console.log("Error playing sound:", error)
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.header}>
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

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#43e97b" />
          <Text style={styles.infoText}>
            Music therapy can help reduce stress, anxiety, and improve your
            mood. Choose a track and relax.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Tracks</Text>

        {MUSIC_TRACKS.map((track) => (
          <View key={track.id} style={styles.trackCard}>
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
                <Text style={styles.trackDuration}> • {track.duration}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => togglePlay(track)}
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
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerInfo: { alignItems: "center" },
  headerDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginTop: 15,
    textAlign: "center",
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e7f9f0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
  },
  infoText: { flex: 1, marginLeft: 12, fontSize: 14, color: "#333" },
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
  trackIconPlaying: { backgroundColor: "#43e97b" },
  trackInfo: { flex: 1, marginLeft: 15 },
  trackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  trackMeta: { flexDirection: "row" },
  trackCategory: { fontSize: 14, color: "#666" },
  trackDuration: { fontSize: 14, color: "#999", marginLeft: 5 },
  playButton: { borderRadius: 25, overflow: "hidden" },
  playButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
})

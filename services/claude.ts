const CLAUDE_API_KEY =
  process.env.EXPO_PUBLIC_CLAUDE_API_KEY || "your-claude-api-key-here"
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"

export interface MoodAnalysis {
  mood: "sad" | "normal" | "happy"
  emotions: string[]
  recommendations: string[]
  severity?: "mild" | "moderate" | "severe"
  concerns?: string[]
}

/**
 * Call Claude API using direct fetch (works in React Native)
 */
async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error("Claude API error:", response.status, errorData)
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || "{}"
}

/**
 * Analyze elderly user's mood based on their daily check-in answers using Claude
 */
export async function analyzeMood(answers: string[]): Promise<MoodAnalysis> {
  try {
    const systemPrompt =
      "You are a compassionate mental health assistant specializing in elderly care. Analyze the emotional well-being of elderly users based on their daily check-in responses. Always respond with valid JSON only, no markdown formatting or code blocks."

    const userMessage = `Analyze the emotional well-being of this elderly user based on their daily check-in responses.

User's answers to daily questions:
${answers.map((answer, index) => `Q${index + 1}: ${answer}`).join("\n")}

Analyze their mood and emotional state. Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "mood": "sad" or "normal" or "happy",
  "emotions": ["emotion1", "emotion2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "severity": "mild" or "moderate" or "severe" (only include this field if mood is "sad"),
  "concerns": ["concern1", "concern2"] (only include this field if there are specific concerns)
}`

    const content = await callClaude(systemPrompt, userMessage)

    // Clean up response in case Claude wraps it in markdown code blocks
    const cleaned = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim()

    const analysis: MoodAnalysis = JSON.parse(cleaned)
    return analysis
  } catch (error) {
    console.error("Error analyzing mood with Claude:", error)
    return {
      mood: "normal",
      emotions: ["unknown"],
      recommendations: [
        "Try some light exercise",
        "Stay connected with loved ones",
        "Take a moment for deep breathing",
      ],
    }
  }
}

/**
 * Generate a heartwarming story for elderly users using Claude
 */
export async function generateStory(
  theme: string = "friendship"
): Promise<string> {
  try {
    const systemPrompt =
      "You are a warm and gentle storyteller for elderly audiences. Create heartwarming, uplifting, and easy-to-follow short stories that bring comfort and joy."

    const userMessage = `Tell me a heartwarming short story about ${theme}. Keep it under 300 words and make it uplifting and comforting for an elderly reader.`

    const story = await callClaude(systemPrompt, userMessage)
    return story
  } catch (error) {
    console.error("Error generating story with Claude:", error)
    return "Once upon a time, in a peaceful village, there lived a kind elderly person who brought joy to everyone they met. Their wisdom and warmth made the world a better place. Every morning, they would sit on their porch and greet neighbors with a warm smile, reminding everyone that small acts of kindness can make the biggest difference."
  }
}

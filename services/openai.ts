import OpenAI from "openai"

// Initialize OpenAI client
// NOTE: Replace with your OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || "your-api-key-here",
})

export interface MoodAnalysis {
  mood: "sad" | "normal" | "happy"
  emotions: string[]
  recommendations: string[]
  severity?: "mild" | "moderate" | "severe"
  concerns?: string[]
}

export async function analyzeMood(answers: string[]): Promise<MoodAnalysis> {
  try {
    const prompt = `You are a compassionate AI assistant analyzing the emotional well-being of elderly users based on their daily check-in responses.

User's answers to daily questions:
${answers.map((answer, index) => `Q${index + 1}: ${answer}`).join("\n")}

Analyze their mood and emotional state. Provide a JSON response with:
1. Overall mood: "sad", "normal", or "happy"
2. Detected emotions (array of emotions like loneliness, anxiety, contentment, joy, etc.)
3. Specific recommendations (array of strings)
4. Severity if mood is sad: "mild", "moderate", or "severe"
5. Specific concerns if any (array of strings)

Respond ONLY with valid JSON in this exact format:
{
  "mood": "sad" | "normal" | "happy",
  "emotions": ["emotion1", "emotion2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "severity": "mild" | "moderate" | "severe" (only if mood is sad),
  "concerns": ["concern1", "concern2"] (optional)
}`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate mental health assistant for elderly care. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content || "{}"
    const analysis: MoodAnalysis = JSON.parse(content)

    return analysis
  } catch (error) {
    console.error("Error analyzing mood:", error)
    // Return a default analysis if API fails
    return {
      mood: "normal",
      emotions: ["unknown"],
      recommendations: ["Try some light exercise", "Stay connected with loved ones"],
    }
  }
}

export async function generateStory(theme: string = "friendship"): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a storyteller for elderly audiences. Create warm, uplifting, and easy-to-follow short stories.",
        },
        {
          role: "user",
          content: `Tell me a heartwarming short story about ${theme}. Keep it under 300 words and make it uplifting.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    })

    return response.choices[0]?.message?.content || "Once upon a time..."
  } catch (error) {
    console.error("Error generating story:", error)
    return "Once upon a time, in a peaceful village, there lived a kind elderly person who brought joy to everyone they met. Their wisdom and warmth made the world a better place."
  }
}

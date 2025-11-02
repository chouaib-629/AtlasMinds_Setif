import { GoogleGenerativeAI } from '@google/generative-ai';

interface EventData {
  title: string;
  description: string;
  type: string;
  attendance_type: string;
  date: string;
  location?: string;
  price?: string | number;
  has_price: boolean;
}

interface EventSuggestions {
  title: string;
  description: string;
  marketingTips: string[];
  engagementStrategies: string[];
  improvements: string[];
  youthAppealScore: number; // Score for the AI-suggested version
  originalYouthAppealScore: number; // Score for the original version
  overallFeedback: string;
  originalTitle?: string;
  originalDescription?: string;
}

/**
 * Analyze event details using Gemini AI and provide youth-focused suggestions
 */
export async function analyzeEventWithGemini(eventData: EventData): Promise<EventSuggestions> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Use gemini-1.5-flash (fast and free tier) or gemini-pro (more capable)
  // Check available models: gemini-1.5-flash, gemini-1.5-pro, gemini-pro
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  // Well-engineered prompt for youth-focused event analysis
  const prompt = `You are an expert event planning consultant specializing in creating engaging events for young people (ages 15-30) in Algeria. Your role is to analyze event proposals and provide actionable, creative suggestions to make them more appealing to youth.

IMPORTANT: The user has already entered their event details. Your job is to:
1. Understand and preserve the user's original intent and core message
2. Suggest improvements that enhance the original content without changing its meaning
3. Make the event more appealing to Algerian youth while keeping the user's values and information intact

USER'S ORIGINAL EVENT DETAILS:
- Title: "${eventData.title}"
- Description: "${eventData.description}"
- Type: ${eventData.type}
- Attendance Type: ${eventData.attendance_type}
- Date: ${eventData.date}
- Location: ${eventData.location || 'Not specified'}
- Price: ${eventData.has_price ? `${eventData.price} DZD` : 'Free'}

ANALYSIS REQUIREMENTS:
1. **Youth Appeal Scores**: Rate from 1-10 how appealing this event would be to Algerian youth, considering factors like:
   - Relevance to youth interests (technology, entrepreneurship, culture, sports, arts)
   - Social engagement opportunities
   - Skill development potential
   - Entertainment value
   - Accessibility (price, location, timing)
   - Clarity and engagement of the title
   - Quality and completeness of the description
   
   You must provide TWO scores and they MUST BE DIFFERENT if your suggestions improve the content:
   - **originalYouthAppealScore**: Score (1-10) for the user's ORIGINAL event details (title and description) based on the actual quality and appeal
   - **youthAppealScore**: Score (1-10) for the AI-SUGGESTED improved version based on the enhanced content
   
   IMPORTANT SCORING GUIDELINES:
   - Be honest and accurate with your scoring
   - If the original is basic or unclear, score it lower (3-6)
   - If the original is already good, score it higher (7-9)
   - If your suggestions significantly improve it, the suggested score should be 1-3 points higher
   - Do NOT default to 8 - evaluate each event individually
   - Consider: Generic titles get lower scores, engaging titles get higher scores
   - Consider: Short/vague descriptions get lower scores, detailed/compelling descriptions get higher scores

2. **Title Enhancement**: Suggest an improved, more catchy and youth-engaged title that:
   - Preserves the original meaning and intent
   - Is more engaging and appealing to youth
   - Keeps it concise (max 60 characters)
   - Maintains the event's core purpose

3. **Description Improvement**: Rewrite the description to be more compelling while:
   - Preserving all the original information the user provided
   - Keeping the same tone and message
   - Making it more energetic and exciting
   - Emphasizing what youth will gain/learn/experience
   - Adding emotional appeal
   - Making the value proposition clearer
   - Keeping it professional but relatable
   - NOT removing or changing any important details from the original

4. **Marketing Tips** (provide 3-4 specific, actionable tips):
   - Social media strategies
   - Content ideas for promotion
   - Target audience segments
   - Best channels to reach Algerian youth

5. **Engagement Strategies** (provide 3-4 ideas):
   - Interactive elements to add
   - Ways to encourage participation
   - Community building suggestions
   - Follow-up activities

6. **Improvements** (provide 3-4 specific suggestions):
   - Content additions (what to add, not what to remove)
   - Format enhancements
   - Technology integration ideas
   - Partnership opportunities

7. **Overall Feedback**: A brief summary (2-3 sentences) highlighting:
   - The event's strengths based on the user's original content
   - Most critical areas for improvement
   - Why your suggestions enhance the original

RESPONSE FORMAT (JSON only, no markdown):
{
  "title": "improved title that preserves user's intent",
  "description": "improved description that includes all original information",
  "marketingTips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "engagementStrategies": ["strategy 1", "strategy 2", "strategy 3", "strategy 4"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4"],
  "originalYouthAppealScore": <number between 1-10, evaluate based on actual quality>,
  "youthAppealScore": <number between 1-10, should be higher if suggestions improve content>,
  "overallFeedback": "Overall feedback text here"
}

CRITICAL SCORING REQUIREMENTS:
- originalYouthAppealScore MUST reflect the actual quality of: "${eventData.title}" and "${eventData.description}"
- youthAppealScore MUST reflect the quality of your suggested improvements
- Scores must be different numbers (not the same) unless the original is already perfect (10/10)
- Do NOT use placeholder numbers - actually evaluate and score based on content quality
- Example: If original title is "Meeting" → score 3-4, If it's "Tech Innovation Summit for Young Entrepreneurs" → score 7-8

CRITICAL REQUIREMENTS:
- Focus on Algerian youth culture and interests
- Consider local context, values, and preferences
- Be practical and actionable
- Ensure suggestions are feasible
- PRESERVE the user's original message and intent - enhance, don't replace
- Make the event sound exciting and valuable
- Return ONLY valid JSON, no additional text before or after`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/```\n?$/, '');
    }
    
    const suggestions = JSON.parse(cleanedText) as EventSuggestions;
    
    // Validate and ensure all fields are present, including original values for comparison
    // Ensure scores are valid numbers between 1-10
    const originalScore = suggestions.originalYouthAppealScore 
      ? Math.max(1, Math.min(10, Number(suggestions.originalYouthAppealScore)))
      : null;
    const suggestedScore = suggestions.youthAppealScore 
      ? Math.max(1, Math.min(10, Number(suggestions.youthAppealScore)))
      : null;
    
    // If scores are missing or invalid, calculate a simple fallback based on content length/quality
    let fallbackOriginalScore = 5;
    let fallbackSuggestedScore = 7;
    
    if (!originalScore || !suggestedScore) {
      // Simple heuristic: longer, more detailed content tends to score higher
      const originalLength = (eventData.title?.length || 0) + (eventData.description?.length || 0);
      const suggestedLength = (suggestions.title?.length || 0) + (suggestions.description?.length || 0);
      
      if (originalLength < 50) fallbackOriginalScore = 3;
      else if (originalLength < 100) fallbackOriginalScore = 5;
      else if (originalLength < 200) fallbackOriginalScore = 6;
      else fallbackOriginalScore = 7;
      
      if (suggestedLength > originalLength) {
        fallbackSuggestedScore = Math.min(10, fallbackOriginalScore + 2);
      } else {
        fallbackSuggestedScore = fallbackOriginalScore + 1;
      }
    }
    
    return {
      title: suggestions.title || eventData.title,
      description: suggestions.description || eventData.description,
      marketingTips: suggestions.marketingTips || [],
      engagementStrategies: suggestions.engagementStrategies || [],
      improvements: suggestions.improvements || [],
      originalYouthAppealScore: originalScore ?? fallbackOriginalScore,
      youthAppealScore: suggestedScore ?? fallbackSuggestedScore,
      overallFeedback: suggestions.overallFeedback || 'Event analysis completed.',
      originalTitle: eventData.title,
      originalDescription: eventData.description,
    };
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    // Provide more helpful error messages
    if (error?.message?.includes('API key')) {
      throw new Error('Gemini API key is invalid or missing. Please check your configuration.');
    } else if (error?.message?.includes('model')) {
      throw new Error('Gemini model is not available. Please try a different model.');
    } else if (error?.message?.includes('quota') || error?.message?.includes('limit')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else {
      throw new Error(error?.message || 'Failed to analyze event. Please try again.');
    }
  }
}


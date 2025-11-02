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
  youthAppealScore: number;
  overallFeedback: string;
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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  // Well-engineered prompt for youth-focused event analysis
  const prompt = `You are an expert event planning consultant specializing in creating engaging events for young people (ages 15-30) in Algeria. Your role is to analyze event proposals and provide actionable, creative suggestions to make them more appealing to youth.

Analyze the following event details and provide comprehensive feedback:

EVENT DETAILS:
- Title: ${eventData.title}
- Description: ${eventData.description}
- Type: ${eventData.type}
- Attendance Type: ${eventData.attendance_type}
- Date: ${eventData.date}
- Location: ${eventData.location || 'Not specified'}
- Price: ${eventData.has_price ? `${eventData.price} DZD` : 'Free'}

ANALYSIS REQUIREMENTS:
1. **Youth Appeal Score**: Rate from 1-10 how appealing this event would be to Algerian youth, considering factors like:
   - Relevance to youth interests (technology, entrepreneurship, culture, sports, arts)
   - Social engagement opportunities
   - Skill development potential
   - Entertainment value
   - Accessibility (price, location, timing)

2. **Title Enhancement**: Suggest an improved, more catchy and youth-engaged title (keep it concise, max 60 characters).

3. **Description Improvement**: Rewrite the description to be more compelling, engaging, and highlight benefits for youth. Make it:
   - More energetic and exciting
   - Emphasize what youth will gain/learn/experience
   - Include emotional appeal
   - Be clear about the value proposition
   - Keep it professional but relatable

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
   - Content additions
   - Format enhancements
   - Technology integration ideas
   - Partnership opportunities

7. **Overall Feedback**: A brief summary (2-3 sentences) highlighting the event's strengths and most critical areas for improvement.

RESPONSE FORMAT (JSON only, no markdown):
{
  "title": "improved title here",
  "description": "improved description here",
  "marketingTips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "engagementStrategies": ["strategy 1", "strategy 2", "strategy 3", "strategy 4"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4"],
  "youthAppealScore": 8,
  "overallFeedback": "Overall feedback text here"
}

IMPORTANT:
- Focus on Algerian youth culture and interests
- Consider local context, values, and preferences
- Be practical and actionable
- Ensure suggestions are feasible
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
    
    // Validate and ensure all fields are present
    return {
      title: suggestions.title || eventData.title,
      description: suggestions.description || eventData.description,
      marketingTips: suggestions.marketingTips || [],
      engagementStrategies: suggestions.engagementStrategies || [],
      improvements: suggestions.improvements || [],
      youthAppealScore: suggestions.youthAppealScore || 5,
      overallFeedback: suggestions.overallFeedback || 'Event analysis completed.',
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to analyze event. Please try again.');
  }
}


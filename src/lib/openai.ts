
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { supabase } from './supabase';


// Types
interface User {
  name: string;
  interests: string[];
  goals: string[];
  communicationStyle?: string;
}

interface ChatPreferences {
  tone: 'empathetic' | 'professional' | 'casual' | 'formal' | 'playful';
  length: 'concise' | 'balanced' | 'detailed';
  style: 'actionable' | 'analytical' | 'narrative' | 'supportive';
}

// Function to detect and format questions at the end of responses
function formatResponse(text: string): string {
    // Split the text into paragraphs
    const paragraphs = text.split('\n\n');
    
    // Check if the last paragraph is a question
    const lastParagraph = paragraphs[paragraphs.length - 1];
    if (lastParagraph.trim().endsWith('?')) {
      // Add line break and make the question bold
      paragraphs[paragraphs.length - 1] = `\n\n**${lastParagraph.trim()}**`;
    }
    
    return paragraphs.join('\n\n');
  }
  

export async function getServerChatResponse(
  messages: ChatCompletionMessageParam[],
  relationship: {
    type: string;
    interests: string[];
    goals: string[];
  },
  profile?: User | null,
  preferences?: ChatPreferences,
  messageCount: number = 0,
  isPremium: boolean = false
): Promise<string> {
    const response = await supabase.functions.invoke('dating-ai', {
        body: JSON.stringify(
            {
                messages,
                relationship,
                profile,
                preferences,
                messageCount,
                isPremium
            }
        )
    })

    return  formatResponse(response.data.response);

}
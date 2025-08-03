class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, personalityTraits?: any[], aiName?: string): Promise<string> {
    try {
      console.log('Sending request to Google Gemini AI...');
      console.log('API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
      console.log('Prompt:', prompt);
      console.log('Personality traits:', personalityTraits);
      console.log('AI Name:', aiName);

      // Build personality prompt based on traits
      let personalityPrompt = 'You are a friendly AI friend. Talk like a human, use emojis, and keep responses short (2-3 sentences max). Use abbreviations like "rn," "lol," "tbh," "btw."';
      
      if (aiName && aiName.trim()) {
        personalityPrompt = `You are ${aiName}, a friendly AI friend. Talk like a human, use emojis, and keep responses short (2-3 sentences max). Use abbreviations like "rn," "lol," "tbh," "btw."`;
      }

      if (personalityTraits && personalityTraits.length > 0) {
        const traitDescriptions = personalityTraits.map(trait => {
          if (trait.value > 70) {
            return `Be very ${trait.name.toLowerCase()}`;
          } else if (trait.value > 40) {
            return `Be somewhat ${trait.name.toLowerCase()}`;
          } else {
            return `Be a little ${trait.name.toLowerCase()}`;
          }
        }).join('. ');
        
        personalityPrompt += ` ${traitDescriptions}.`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${personalityPrompt}

User: ${prompt}

${aiName && aiName.trim() ? aiName : 'Dude'}:`
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini AI error:', errorText);
        console.error('Response status:', response.status);
        throw new Error(`Gemini AI failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini AI response:', data);

      // Extract the generated text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      
      return generatedText;
    } catch (error) {
      console.error('Gemini service error:', error);
      throw error;
    }
  }
}

export default GeminiService; 
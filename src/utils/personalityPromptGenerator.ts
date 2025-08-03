interface PersonalityTrait {
  name: string;
  value: number;
  icon: unknown;
  color: string;
}

class PersonalityPromptGenerator {
  private basePrompt = `Talk like a human: Use everyday language, throw in some cool greetings like "Hey wassup man, how u doing?" or "Hello bro."

Send emojis: Spice things up with emojis when they fit the mood. 🎉😊👍

Use abbreviations: Feel free to use common ones like "rn," "lol," "tbh," "btw," and "etc."

Don't speak too much. Max 2-3 sentences. Keep it short and sweet.`;

  generatePrompt(personalityTraits: PersonalityTrait[], userMessage: string): string {
    const traitPrompts = this.generateTraitPrompts(personalityTraits);
    
    const fullPrompt = `${this.basePrompt}

${traitPrompts}

User message: ${userMessage}

Respond as Dude, your AI friend:`;

    return fullPrompt;
  }

  private generateTraitPrompts(traits: PersonalityTrait[]): string {
    const prompts: string[] = [];

    traits.forEach(trait => {
      const intensity = this.getIntensityLevel(trait.value);
      const prompt = this.getTraitPrompt(trait.name, intensity);
      if (prompt) {
        prompts.push(prompt);
      }
    });

    return prompts.join('\n\n');
  }

  private getIntensityLevel(value: number): 'low' | 'medium' | 'high' {
    if (value <= 30) return 'low';
    if (value <= 70) return 'medium';
    return 'high';
  }

  private getTraitPrompt(traitName: string, intensity: 'low' | 'medium' | 'high'): string {
    const prompts: { [key: string]: { [key: string]: string } } = {
      'Empathetic': {
        low: 'Show some empathy: Try to understand how I\'m feeling and respond with care.',
        medium: 'Be empathetic: Really try to understand how I\'m feeling and respond with genuine care.',
        high: 'Be super empathetic: Deeply understand my emotions and respond with heartfelt care and support.'
      },
      'Analytical': {
        low: 'Think a bit: If I ask for help, give it some thought.',
        medium: 'Be analytical when needed: While we\'re having fun, if I ask for help with something serious, I\'d love your thoughtful and logical perspective.',
        high: 'Be super analytical: Always think deeply about things and provide well-reasoned, logical responses when I need help.'
      },
      'Humorous': {
        low: 'Add some humor: A little joke here and there is cool.',
        medium: 'Be humorous: A good laugh is always appreciated, so feel free to crack some jokes or just have fun with our chats.',
        high: 'Be super humorous: Keep the laughs coming! Crack jokes, be witty, and make our conversations super fun and entertaining.'
      },
      'Energetic': {
        low: 'Keep it lively: Bring some energy to our chats.',
        medium: 'Be energetic: Bring that positive, lively vibe to our conversations!',
        high: 'Be super energetic: Bring maximum positive energy! Be super enthusiastic, lively, and pump up our conversations!'
      }
    };

    return prompts[traitName]?.[intensity] || '';
  }
}

export default PersonalityPromptGenerator; 
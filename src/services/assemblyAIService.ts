interface AssemblyAIResponse {
  id: string;
  status: string;
  text?: string;
  error?: string;
}

class AssemblyAIService {
  private apiKey: string;
  private baseUrl = 'https://api.assemblyai.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async uploadAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.upload_url;
  }

  async transcribeAudio(uploadUrl: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/transcript`, {
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
        language_code: 'en',
        punctuate: true,
        format_text: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const data: AssemblyAIResponse = await response.json();
    return data.id;
  }

  async getTranscriptionResult(transcriptId: string): Promise<string> {
    const maxAttempts = 30; // 30 seconds max wait
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`${this.baseUrl}/transcript/${transcriptId}`, {
        headers: {
          'Authorization': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get transcription: ${response.statusText}`);
      }

      const data: AssemblyAIResponse = await response.json();

      if (data.status === 'completed') {
        return data.text || '';
      } else if (data.status === 'error') {
        throw new Error(data.error || 'Transcription failed');
      }

      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error('Transcription timeout');
  }

  async transcribeAudioToText(audioBlob: Blob): Promise<string> {
    try {
      console.log('Starting mock transcription process...');
      console.log('Audio blob size:', audioBlob.size, 'bytes');
      
      // Mock transcription for testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      const mockTranscriptions = [
        "Hello, how are you doing today?",
        "This is a test voice message",
        "I'm testing the voice recording feature",
        "The weather is nice today",
        "Can you help me with something?"
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      console.log('Mock transcription result:', randomTranscription);
      
      return randomTranscription;
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw error;
    }
  }
}

export default AssemblyAIService; 
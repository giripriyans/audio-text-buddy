import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Pause, Download, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Simulate speech-to-text
        const userMessage: VoiceMessage = {
          id: Date.now().toString(),
          type: 'user',
          text: "Hello, I'm speaking to you via voice!",
          audioUrl,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        
        // Simulate AI response
        setTimeout(() => {
          const botMessage: VoiceMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            text: "Hello! I heard you loud and clear. How can I help you today?",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
          
          // Simulate text-to-speech for bot response
          speakText(botMessage.text);
        }, 1000);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Simulate audio level animation
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setAudioLevel(0);
      }, 5000);

    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to use voice chat.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    
    const audio = new Audio(audioUrl);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };
  };

  const downloadConversation = () => {
    // TODO: Implement actual audio export
    toast({
      title: "Download Started",
      description: "Your conversation is being prepared for download.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Voice Waveform Visualization */}
      <Card className="p-6 mb-4 bg-gradient-to-r from-hsl(var(--voice-background)) to-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Voice Chat Active</span>
            <Badge variant={isRecording ? "default" : "secondary"}>
              {isRecording ? "Recording" : "Ready"}
            </Badge>
          </div>
          
          {/* Animated Waveform */}
          <div className="flex items-center space-x-1 h-16">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full transition-all duration-100"
                style={{
                  height: isRecording ? `${Math.random() * 60 + 4}px` : '4px',
                  opacity: isRecording ? 1 : 0.3
                }}
              />
            ))}
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="rounded-full h-16 w-16"
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            
            <Button
              onClick={downloadConversation}
              variant="outline"
              size="lg"
              className="rounded-full h-16 w-16"
            >
              <Download className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-xs p-4 ${
              message.type === 'user' 
                ? 'bg-hsl(var(--chat-user)) text-hsl(var(--chat-user-foreground))' 
                : 'bg-hsl(var(--chat-bot)) text-hsl(var(--chat-bot-foreground))'
            }`}>
              <p className="text-sm mb-2">{message.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                {message.audioUrl && (
                  <Button
                    onClick={() => playAudio(message.audioUrl!)}
                    variant="ghost"
                    size="sm"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceChat;
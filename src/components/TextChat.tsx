import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const TextChat = () => {
  const [messages, setMessages] = useState<TextMessage[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: TextMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: TextMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: generateAIResponse(userMessage.text),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // Simple response generation for demo
    const responses = [
      "That's an interesting question! Let me think about that...",
      "I understand what you're asking. Here's my perspective on that:",
      "Great question! I'd be happy to help you with that.",
      "That's a fascinating topic. Here's what I know about it:",
      "Thanks for sharing that with me. Let me provide some insights:"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " This is a simulated response. Connect to an AI service for real responses!";
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export
    toast({
      title: "Export Started",
      description: "Your chat history is being exported to PDF.",
    });
  };

  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and export */}
      <div className="flex items-center space-x-2 p-4 border-b">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={exportToPDF} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[70%] p-4 ${
                message.type === 'user' 
                  ? 'bg-hsl(var(--chat-user)) text-hsl(var(--chat-user-foreground))' 
                  : 'bg-hsl(var(--chat-bot)) text-hsl(var(--chat-bot-foreground))'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <Card className="max-w-[70%] p-4 bg-hsl(var(--chat-bot)) text-hsl(var(--chat-bot-foreground))">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!inputText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextChat;
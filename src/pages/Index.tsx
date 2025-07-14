import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceChat from '@/components/VoiceChat';
import TextChat from '@/components/TextChat';
import { Bot, Mic, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('voice');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">AI Chat Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Voice-First AI
              </Badge>
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Chat Interface</span>
              <Badge variant="outline">
                {activeTab === 'voice' ? 'Voice Mode' : 'Text Mode'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="voice" className="flex items-center space-x-2">
                  <Mic className="h-4 w-4" />
                  <span>Voice Chat</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Text Chat</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="voice" className="h-[calc(100%-60px)]">
                <VoiceChat />
              </TabsContent>
              
              <TabsContent value="text" className="h-[calc(100%-60px)]">
                <TextChat />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;

'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { storage } from '@/data/demo-data';

export default function AssistantPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [user, setUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userData = storage.getUser();
        if (userData) {
            setUser(userData);
            // Load chat history
            const history = localStorage.getItem(`focusflow_chat_${userData.id}`);
            if (history) {
                setMessages(JSON.parse(history));
            } else {
                // Welcome message
                setMessages([{
                    id: '1',
                    role: 'assistant',
                    content: "Bonjour ! Je suis votre assistant IA pour la productivité. Comment puis-je vous aider aujourd'hui ?",
                    timestamp: new Date().toISOString(),
                }]);
            }
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (user && messages.length > 0) {
            localStorage.setItem(`focusflow_chat_${user.id}`, JSON.stringify(messages));
        }
    }, [messages, user]);

    const getAIResponse = async (userMessage: string): Promise<string> => {
        // Mock AI responses
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowercaseMessage = userMessage.toLowerCase();

        if (lowercaseMessage.includes('task') || lowercaseMessage.includes('tâche')) {
            return "Je vais analyser vos tâches actuelles. Vous avez plusieurs tâches high-priority qui nécessitent une attention immédiate. Je recommande de commencer par les tâches avec deadline proche.";
        }

        if (lowercaseMessage.includes('focus') || lowercaseMessage.includes('concentration')) {
            return "Pour améliorer votre concentration, je vous suggère d'utiliser la page Focus Modes. Le mode 'Pluie Apaisante' est particulièrement efficace pour le deep work.";
        }

        if (lowercaseMessage.includes('plan') || lowercaseMessage.includes('schedule')) {
            return "Voulez-vous que je génère un planning optimisé pour aujourd'hui ? Je peux organiser vos tâches en fonction de votre niveau d'énergie et de vos préférences.";
        }

        return "Je comprends votre question. En tant qu'assistant IA, je peux vous aider avec la planification de vos tâches, l'organisation de votre journée, et des conseils de productivité. Que souhaitez-vous faire ?";
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        const aiResponse = await getAIResponse(input);

        const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    const handleQuickAction = async (action: 'reorganize' | 'plan') => {
        setIsTyping(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const responses = {
            reorganize: "J'ai analysé vos tâches et votre planning actuel. Voici ma recommandation :\n\n1. **Matin (9h-12h)**: Deep work sur tâches high-priority\n2. **Après-midi (14h-17h)**: Réunions et tâches collaboratives\n3. **Fin de journée**: Tâches administratives légères\n\nVoulez-vous que j'applique cette réorganisation ?",
            plan: "Voici votre plan de productivité personnalisé :\n\n✅ **Priorités**: 2 tâches urgentes à terminer aujourd'hui\n⏰ **Temps focus**: 4h de deep work\n☕ **Pauses**: 3 pauses de 15 min\n🎯 **Objectif**: Compléter 80% des tâches planifiées\n\nCommencez par la tâche la plus importante dès maintenant !",
        };

        const message: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: responses[action],
            timestamp: new Date().toISOString(),
            type: 'action',
        };

        setMessages(prev => [...prev, message]);
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Toujours prêt à vous aider</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-2xl px-4 py-3 rounded-2xl ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-card'
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p
                                className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 shadow-card px-4 py-3 rounded-2xl">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button
                        onClick={() => handleQuickAction('reorganize')}
                        disabled={isTyping}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reorganize my day
                    </button>
                    <button
                        onClick={() => handleQuickAction('plan')}
                        disabled={isTyping}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate productivity plan
                    </button>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Demandez-moi quelque chose..."
                        className="flex-1 input-field"
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="btn-primary px-4"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import { Settings, Bot, Send } from "lucide-react";
import { ChatMessage } from "./components/ChatMessage";
import { ConversationList } from "./components/ConversationList";
import { SettingsDialog } from "./components/Settings";
import type { Message, Conversation, Settings as SettingsType } from "./types";

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState<SettingsType>({
    apiKey: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_BASE_URL,
    model: import.meta.env.VITE_DEFAULT_MODEL,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([
    "deepseek-r1-distill-qwen-7b",
  ]);

  useEffect(() => {
    if (settings.apiKey) {
      const openai = new OpenAI({
        apiKey: settings.apiKey,
        baseURL: settings.baseUrl,
        dangerouslyAllowBrowser: true,
      });

      openai.models.list().then((response) => {
        const models = response.data.map((model) => model.id);
        setAvailableModels(models);
      });
    }
  }, [settings.apiKey, settings.baseUrl]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setConversations([...conversations, newConv]);
    setActiveConversation(newConv.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation("");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !settings.apiKey) return;

    const currentConv = conversations.find(
      (conv) => conv.id === activeConversation
    );
    if (!currentConv) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...currentConv.messages, userMessage];

    setConversations(
      conversations.map((conv) =>
        conv.id === activeConversation
          ? { ...conv, messages: updatedMessages }
          : conv
      )
    );
    setInput("");

    try {
      const openai = new OpenAI({
        apiKey: settings.apiKey,
        baseURL: settings.baseUrl,
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.chat.completions.create({
        model: settings.model,
        messages: updatedMessages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0].message.content || "",
      };

      setConversations(
        conversations.map((conv) =>
          conv.id === activeConversation
            ? { ...conv, messages: [...updatedMessages, assistantMessage] }
            : conv
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === activeConversation
  );

  return (
    <div className="flex h-screen bg-white">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onSelect={setActiveConversation}
        onNew={createNewConversation}
        onDelete={deleteConversation}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold"> AI Chat </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        {showSettings ? (
          <div className="p-4">
            <SettingsDialog
              settings={settings}
              onUpdate={setSettings}
              availableModels={availableModels}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {currentConversation?.messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react'

const initialMessages = [
  {
    id: 1,
    text: "Hello there! 👋 I'm your MindCare AI companion. I'm here to listen, support, and help you navigate your feelings. How are you doing today?",
    sender: 'ai',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    text: "You can talk to me about anything - stress, anxiety, relationships, work pressure, or just your day. I'm here to provide a safe, non-judgmental space.",
    sender: 'ai',
    timestamp: new Date(Date.now() - 240000)
  }
]

const quickReplies = [
  "I'm feeling anxious 😰",
  "I need coping strategies 🧘",
  "I want to track my mood 📊",
  "Can you help me relax? 😌",
  "I'm having trouble sleeping 😴",
  "Work is stressing me out 💼"
]

export default function ChatBot({ fullMode = false }) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages([...messages, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponses = [
        "Thank you for sharing that with me. It takes courage to open up. How has this been affecting your daily life?",
        "I hear you. That sounds really challenging. Remember, it's okay to feel this way. Would you like to explore some coping strategies together?",
        "I understand. What you're experiencing is valid. Let's break this down together - what's one small step you could take to feel better?",
        "Thank you for trusting me with this. Let's work through this together. Have you noticed any patterns in when these feelings arise?",
        "I appreciate you sharing this. It's important to acknowledge our feelings. Would you like to try a quick breathing exercise to help center yourself?",
        "That sounds tough. Remember, progress isn't linear and it's okay to have difficult days. What's something kind you could do for yourself right now?"
      ]
      
      const aiMessage = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply) => {
    setInput(reply)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`${fullMode ? 'h-full' : 'h-[500px]'} flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden`}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">MindCare AI</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm">Online • Empathetic listener</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      <div className="p-4 border-b bg-blue-50">
        <p className="text-sm text-gray-600 mb-2">Quick start:</p>
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-50 transition hover:scale-105"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-end gap-2 mb-1">
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`rounded-2xl p-4 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right pr-12' : 'pl-12'}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Sparkles className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Safety Notice */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Important:</strong> MindCare AI provides supportive conversations but is not a substitute for professional medical care. 
            If you're in crisis, please contact emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
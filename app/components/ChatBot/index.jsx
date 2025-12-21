'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Bot, User, Sparkles, Calendar, BookOpen, PhoneCall } from 'lucide-react'

const initialMessages = [
  {
    id: 1,
    text: "Hello! I'm your MindCare AI companion. I'm here to listen, support, and help you navigate your feelings. How are you doing today?",
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
  "I'm feeling anxious.",
  'I need coping strategies.',
  'I want to track my mood.',
  'Can you help me relax?',
  "I'm having trouble sleeping.",
  'Work is stressing me out.'
]

export default function ChatBot({ fullMode = false }) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)

  const heightClass = fullMode
    ? 'min-h-[60vh] h-[70vh] max-h-[900px] sm:min-h-[70vh] sm:h-[78vh]'
    : 'min-h-[420px] h-[65vh] max-h-[760px] sm:min-h-[560px] sm:h-[72vh]'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse user in storage', e)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    if (!user?.id) {
      setError('Please sign in to use the chat.')
      return
    }

    const userMessage = {
      id: Date.now(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date()
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)
    setError('')

    try {
      const conversationHistory = messages
        .filter((msg) => msg.sender === 'user' || msg.sender === 'ai')
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }))
        .slice(-12)

      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify({
          userId: user.id,
          message: trimmed,
          conversationHistory,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error('Chat request failed', err)
      setError('Sorry, I could not reach the assistant right now. Please try again.')
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply) => {
    setInput(reply)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`${heightClass} w-full flex flex-col bg-white/95 backdrop-blur-xl rounded-3xl border border-white/70 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 dark:bg-slate-900/80 dark:border-white/10`}>
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">MindCare AI</h3>
                <div className="flex items-center gap-2 text-white/85 text-sm">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                  Online - Empathetic listener
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/80 bg-white/10 px-3 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              Privacy-first support
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-4 dark:bg-slate-900/70 dark:border-white/10">
          <p className="text-sm text-slate-600">
            Tell me what is on your mind. I will listen, validate your feelings, and suggest small steps that can help.
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="whitespace-nowrap bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-50 transition"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-slate-50 dark:bg-slate-950/40">
        {!user?.id && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Sign in to chat with MindCare AI. Your conversations are private and secure.
            <div className="mt-2">
              <Link href="/auth/signin" className="inline-flex items-center gap-2 text-amber-900 font-semibold underline underline-offset-4">
                Continue to sign in
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-end gap-3 mb-2">
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                    : 'bg-white text-slate-800 rounded-bl-md border border-slate-100'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-9 h-9 bg-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
              <div className={`text-xs text-slate-400 ${msg.sender === 'user' ? 'text-right pr-12' : 'pl-12'}`}>
                {msg.sender === 'user' ? 'You' : 'MindCare AI'} - {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md border border-slate-100 px-4 py-3 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Action Bar */}
      <div className="border-t border-slate-200 bg-white/95 px-6 py-4 space-y-3 dark:bg-slate-900/80 dark:border-white/10">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/psychiatrists"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 transition"
          >
            <Calendar className="w-4 h-4" />
            Book a psychiatrist
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 transition"
          >
            <BookOpen className="w-4 h-4" />
            Explore resources
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            <PhoneCall className="w-4 h-4" />
            Emergency: 999 (Bangladesh)
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Share what is going on. I am here to help."
              className="w-full resize-none border border-slate-200 rounded-2xl px-5 py-4 pr-12 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400 dark:border-white/10"
            />
            <Sparkles className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          This assistant offers supportive guidance, not medical diagnosis. If you are in immediate danger, call 999.
        </p>
      </div>
    </div>
  )
}

'use client'

import Chatbot from '@/app/components/ChatBot'
import Link from 'next/link'
import { Calendar, HeartHandshake, Shield, Sparkles, PhoneCall, BookOpen } from 'lucide-react'

export default function ChatBotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 shadow-sm text-sm text-slate-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                24/7 support • Confidential • Mental wellness
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-dark mt-6 mb-4 leading-tight">
                Chat with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  MindCare AI
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-500">
                A calm space to talk things through, get coping ideas, and find the next best step.
              </p>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
              <div className="soft-card rounded-3xl bg-white/95 border border-white/60 p-2">
                <Chatbot fullMode />
              </div>

              <aside className="space-y-6">
                <div className="soft-card rounded-3xl bg-white/95 border border-white/60 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-dark">How this chat helps</h2>
                      <p className="text-sm text-neutral-500">Supportive, practical, and safe</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-600 mt-0.5" />
                      Share what you are feeling and what is happening.
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-600 mt-0.5" />
                      Get 1–3 small coping steps you can try today.
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-600 mt-0.5" />
                      When needed, we guide you to professional care.
                    </li>
                  </ul>
                  <div className="mt-5 flex flex-col gap-2">
                    <Link
                      href="/psychiatrists"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
                    >
                      <Calendar className="w-4 h-4" />
                      Book a psychiatrist
                    </Link>
                    <Link
                      href="/resources"
                      className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-3 rounded-xl font-semibold text-neutral-dark hover:bg-slate-50 transition"
                    >
                      <BookOpen className="w-4 h-4" />
                      Browse resources
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-rose-900">Crisis support</h3>
                      <p className="text-sm text-rose-800 mt-1">
                        If you are in immediate danger, call <span className="font-semibold">999</span> (Bangladesh) or go to the nearest hospital.
                      </p>
                      <p className="text-xs text-rose-700 mt-3">
                        MindCare AI is supportive, not a replacement for emergency services.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

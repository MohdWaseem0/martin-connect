'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  speaker: 'MARTIN (AI)' | 'YOU (CANDIDATE)';
  content: string;
  timestamp: string;
}

export default function SeekerAIInterviewer() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [sessionTime, setSessionTime] = useState(14 * 60 + 22); // starting mock time
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(3); // Q4
  const [questionTimer, setQuestionTimer] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [typedResponse, setTypedResponse] = useState('');
  
  const [clarity, setClarity] = useState(94);
  const [confidence, setConfidence] = useState(88);

  const questions = [
    'Tell me about yourself and your background in design/engineering.',
    'What is your experience building scalable React portals and working with Next.js App Router?',
    'How do you optimize bundle sizes, caching, and layout transitions in production code?',
    'Describe a situation where you had to influence a stakeholder who had a completely different technical perspective.',
    'How do you manage conflicting priorities in a fast-paced development sprint?',
    'Explain the differences between standard client-side rendering and Server Components in Next.js.',
  ];

  const [transcript, setTranscript] = useState<Message[]>([
    {
      speaker: 'MARTIN (AI)',
      content: 'Great answer about Next.js components optimization. Let’s move to behavioral strategies.',
      timestamp: '14:15',
    },
    {
      speaker: 'YOU (CANDIDATE)',
      content: 'I typically use lighthouse metrics to analyze render waterfalls and configure route pre-fetching.',
      timestamp: '14:20',
    },
  ]);

  // Session timer incrementer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Question timer countdown
  useEffect(() => {
    const qTimer = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          // Progress to next question when time hits 0
          handleNextQuestion();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(qTimer);
  }, [currentQuestionIdx]);

  // Live video stream setup
  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 640, height: 480 }, audio: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.warn('Webcam not permitted or unavailable, running placeholder mode.', err);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraOn]);

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setQuestionTimer(45);
      
      // Simulate Martin asking the next question
      const martinQuestion = questions[currentQuestionIdx + 1];
      setTranscript((prev) => [
        ...prev,
        {
          speaker: 'MARTIN (AI)',
          content: martinQuestion,
          timestamp: formatTime(sessionTime),
        },
      ]);
    } else {
      alert('Mock interview complete! Analyzing response analytics.');
      router.push('/dashboard/seeker/interviews');
    }
  };

  const handleSendAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedResponse.trim()) return;

    setTranscript((prev) => [
      ...prev,
      {
        speaker: 'YOU (CANDIDATE)',
        content: `"${typedResponse.trim()}"`,
        timestamp: formatTime(sessionTime),
      },
    ]);

    setTypedResponse('');
    
    // Simulate real-time metrics change on response
    setClarity(Math.floor(Math.random() * 10) + 90);
    setConfidence(Math.floor(Math.random() * 15) + 80);

    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background text-on-background flex flex-col h-screen overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16 px-lg bg-white border-b border-[#E8EEF7] shrink-0">
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs cursor-pointer" onClick={() => router.push('/dashboard/seeker/interviews')}>
            <span className="material-symbols-outlined text-[20px] text-primary">arrow_back</span>
            <span className="font-headline-sm text-[20px] font-bold text-[#081126]">Martin Connect</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/60 mx-sm"></div>
          <div className="flex flex-col">
            <span className="font-title-sm text-body-sm text-on-surface leading-tight font-bold">AI Interview Practice</span>
            <span className="font-body-sm text-[10px] text-outline uppercase tracking-wider font-semibold">Session ID: MC-88219</span>
          </div>
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm bg-surface-container-low px-md py-sm rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
            <span className="font-mono-label text-primary font-bold">{formatTime(sessionTime)}</span>
          </div>
        </div>
      </header>

      {/* Main split dashboard */}
      <main className="flex-1 flex overflow-hidden p-md gap-md">
        {/* Left Aside: Real-time Transcript & Metrics */}
        <aside className="w-[320px] flex flex-col gap-md shrink-0">
          
          {/* Sentiment Tracker */}
          <div className="bg-white rounded-xl border border-[#E8EEF7] p-md flex flex-col gap-md shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-title-sm text-on-surface uppercase text-[11px] font-bold tracking-wider">Real-time Insights</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span className="text-[#16A34A] font-mono-label text-[10px] font-bold tracking-wider">LIVE</span>
              </div>
            </div>
            <div className="space-y-md">
              <div>
                <div className="flex justify-between mb-1 text-body-sm">
                  <span className="text-on-surface-variant font-medium">Confidence Level</span>
                  <span className="font-mono-label text-primary font-bold">{confidence}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <motion.div className="bg-primary h-full" animate={{ width: `${confidence}%` }}></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-body-sm">
                  <span className="text-on-surface-variant font-medium">Speaking Clarity</span>
                  <span className="font-mono-label text-primary font-bold">{clarity}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <motion.div className="bg-primary h-full" animate={{ width: `${clarity}%` }}></motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialog Log */}
          <div className="flex-1 bg-white rounded-xl border border-[#E8EEF7] flex flex-col overflow-hidden shadow-sm">
            <div className="p-md border-b border-[#E8EEF7] flex items-center gap-sm shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              <h3 className="font-title-sm text-on-surface uppercase text-[11px] tracking-wider font-bold">Transcript</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-md space-y-md custom-scrollbar">
              {transcript.map((msg, i) => (
                <div key={i} className="space-y-xs">
                  <div className="flex justify-between font-mono-label text-[10px] text-outline font-bold">
                    <span>{msg.speaker}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p
                    className={`font-body-sm p-sm rounded-lg text-body-sm leading-relaxed ${
                      msg.speaker.startsWith('MARTIN')
                        ? 'bg-surface-container-low text-on-surface-variant rounded-tl-none border border-outline-variant/20'
                        : 'bg-primary-container/10 text-on-surface rounded-tr-none border border-primary/10'
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Section: Video Stream & Current Question */}
        <section className="flex-1 flex flex-col gap-md">
          {/* Main Stage */}
          <div className="flex-grow relative rounded-2xl overflow-hidden bg-[#081126] shadow-2xl border border-outline-variant/30 flex items-center justify-center">
            
            {/* Live Camera View */}
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center text-outline-variant/80 p-md flex flex-col items-center">
                <span className="material-symbols-outlined text-[48px] mb-xs">videocam_off</span>
                <p className="font-title-sm font-bold">Camera Turned Off</p>
              </div>
            )}
            
            <div className="absolute inset-0 video-gradient-overlay pointer-events-none"></div>

            {/* AI Avatar Martin */}
            <div className="absolute top-6 right-6 w-40 h-52 rounded-xl border border-white/20 overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl z-10">
              <div className="absolute inset-0 ai-pulse bg-primary/10 pointer-events-none"></div>
              <img
                alt="Martin AI Avatar"
                className="w-full h-full object-cover mix-blend-screen opacity-70"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0O9hAQr4YsAz1xd93gxieVMhzMwU0kggIlJXOqAsHFwgC6iRlUVcG-kgMZpNY6Ya6-bNjuxdeKNw2JG9KMUiElXHuyHjxig7okVtPMuH_BCUPt4zn8MgWMZUJf245NmM-rJeaozPlBEGCrW3G6c92M0bR8jajbWNLcshs69CHg0dfLOQh7mTkDohLTtc99LF0UtfOyQ3J14dgdApjy7SsyCr9plndmpPFOcSutMGYHBq5MIVpFOnBGPvCdt_01przkIKcedcHKsY"
              />
              <div className="absolute bottom-0 left-0 right-0 p-sm bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-xs select-none">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,83,219,0.8)]"></div>
                  <span className="font-mono-label text-white text-[9px] tracking-wider font-semibold uppercase">Martin Coach</span>
                </div>
              </div>
            </div>

            {/* Current Question Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-center">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-outline-variant/30 p-lg shadow-2xl flex items-center gap-md w-full max-w-2xl">
                <div className="flex-shrink-0 w-14 h-14 rounded-full border-[3px] border-primary border-t-transparent animate-spin flex items-center justify-center">
                  <span className="font-mono-label text-primary text-title-sm font-bold">{questionTimer}s</span>
                </div>
                <div className="flex-grow border-l border-outline-variant/30 pl-md">
                  <span className="font-mono-label text-primary uppercase text-[10px] font-bold tracking-wider block mb-1">
                    Current Question ({currentQuestionIdx + 1} of {questions.length})
                  </span>
                  <h2 className="font-title-sm text-on-surface leading-tight font-bold">
                    {questions[currentQuestionIdx]}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Response Form & Action Controls */}
          <div className="bg-white rounded-xl border border-[#E8EEF7] p-md flex flex-col gap-md shadow-sm shrink-0">
            {/* Answer Input */}
            <form onSubmit={handleSendAnswer} className="flex gap-sm">
              <input
                type="text"
                placeholder="Type your response here to practicing answering, then hit send..."
                className="flex-1 p-md border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-body-md shadow-inner bg-surface-container-lowest"
                value={typedResponse}
                onChange={(e) => setTypedResponse(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white px-lg py-md rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </form>

            {/* Hardware Controls */}
            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-md">
              <div className="flex items-center gap-md select-none">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex flex-col items-center gap-xs cursor-pointer group`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? 'bg-error text-white' : 'bg-surface-container hover:bg-primary/10 hover:text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{isMuted ? 'mic_off' : 'mic'}</span>
                  </div>
                  <span className="font-mono-label text-[9px] uppercase text-outline font-bold">Mute</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`flex flex-col items-center gap-xs cursor-pointer group`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    !cameraOn ? 'bg-error text-white' : 'bg-surface-container hover:bg-primary/10 hover:text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{cameraOn ? 'videocam' : 'videocam_off'}</span>
                  </div>
                  <span className="font-mono-label text-[9px] uppercase text-outline font-bold">Camera</span>
                </button>
              </div>

              <div className="flex items-center gap-lg">
                <div className="flex flex-col items-end text-right">
                  <span className="font-mono-label text-[10px] uppercase text-outline font-bold">Signal</span>
                  <div className="flex gap-[3px] mt-1 select-none">
                    <div className="w-1 h-3 bg-primary rounded-full"></div>
                    <div className="w-1 h-3 bg-primary rounded-full"></div>
                    <div className="w-1 h-3 bg-primary rounded-full"></div>
                    <div className="w-1 h-3 bg-primary rounded-full"></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to end this practice session?')) {
                      router.push('/dashboard/seeker/interviews');
                    }
                  }}
                  className="px-lg py-2.5 bg-error hover:bg-error/95 text-white font-bold rounded-xl flex items-center gap-sm active:scale-95 transition-all shadow-md cursor-pointer text-body-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">call_end</span>
                  <span>End Session</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

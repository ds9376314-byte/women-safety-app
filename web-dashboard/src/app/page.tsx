"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Shield, Bell, MapPin, Activity, Lock, Users, ChevronRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0A0514] text-white font-sans overflow-x-hidden selection:bg-fuchsia-500/30 pb-0">
      
      {/* GLOBAL BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* NAVBAR */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
        <nav className="pointer-events-auto flex justify-between items-center px-6 py-3 max-w-4xl w-full backdrop-blur-2xl bg-[#11091F]/80 border border-white/10 rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)] group-hover:scale-110 transition-transform overflow-hidden relative">
              <Image src="/logo.png" alt="Shevora" fill className="object-cover scale-[1.3]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white group-hover:text-fuchsia-100 transition-colors">Shevora</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <a href="#how-it-works" className="text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
          </div>
        </nav>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-24 md:pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300 font-medium text-xs md:text-sm">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
            V1.0 is now live
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
            Safety that fits in your pocket.
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]">
              Empowering Women.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-xl">
            Shevora is an advanced personal safety application providing real-time tracking, discrete SOS alerts, and a secure cloud vault. Designed beautifully for your absolute peace of mind.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-blue-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <Download className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-white group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="relative z-10 text-white">Download APK</span>
            </button>
            <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-base md:text-lg">
              Learn more <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg aspect-square">
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/20 to-blue-500/20 blur-[80px] rounded-full" />
          <Image 
            src="/hero_shield.png" 
            alt="Shevora Safety Shield Concept" 
            fill 
            className="object-contain relative z-10 drop-shadow-[0_0_50px_rgba(217,70,239,0.5)] animate-[float_6s_ease-in-out_infinite]"
            priority
          />
        </div>
      </section>

      {/* 2. OUR MISSION / ABOUT */}
      <section className="relative z-10 bg-[#11091F]/50 border-y border-white/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-6 md:space-y-8">
          <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight">Built for a safer tomorrow.</h3>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We believe that safety is a fundamental right. Shevora was born from the necessity to provide women with a reliable, invisible, and highly effective tool to protect themselves.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 md:gap-12 pt-8">
             <div className="flex flex-col items-center gap-2">
                <span className="text-3xl md:text-4xl font-black text-fuchsia-400">100%</span>
                <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-widest">Encrypted</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-3xl md:text-4xl font-black text-blue-400">24/7</span>
                <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-widest">Active Protection</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-3xl md:text-4xl font-black text-purple-400">&lt; 1s</span>
                <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-widest">SOS Response</span>
             </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 relative w-full max-w-md lg:max-w-lg aspect-square mt-8 lg:mt-0">
          <Image 
            src="/trust_network.png" 
            alt="Shevora Trust Network" 
            fill 
            className="object-cover rounded-[2rem] md:rounded-[3rem] shadow-[0_0_30px_rgba(59,130,246,0.3)] md:shadow-[0_0_50px_rgba(59,130,246,0.3)] border border-white/10"
          />
        </div>
        
        <div className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left">
          <div>
            <h3 className="text-fuchsia-400 font-bold tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-3">How it works</h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Your Trust Circle, <br className="hidden md:block"/>activated instantly.</h2>
          </div>
          
          <div className="space-y-6 text-left">
            {[
              { title: "Install and Setup Disguise", desc: "Download the APK. The app disguises itself as a Calculator. Use the default PIN '8055' and press '=' to unlock the hidden SOS dashboard, then change it in Settings." },
              { title: "Add Trusted Contacts", desc: "Add up to 5 family members or friends. They will receive automated SMS alerts even without internet." },
              { title: "Trigger Emergency SOS", desc: "If you feel unsafe, rapidly press your volume button or shout your secret phrase to trigger the alarm silently." },
              { title: "Live Tracking & Cloud Upload", desc: "Shevora immediately starts recording audio and uploads it to a secure cloud, while broadcasting your live GPS location." }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold border border-fuchsia-500/30 flex-shrink-0 mt-1">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-white mb-1">{step.title}</h4>
                  <p className="text-sm md:text-base text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DETAILED FEATURES GRID */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Uncompromising Features.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to stay safe, engineered into a single seamless application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Bell />, title: "Discreet SOS", desc: "Trigger high-priority alerts with volume buttons or voice patterns without taking your phone out.", color: "from-red-500 to-orange-500" },
            { icon: <MapPin />, title: "Live Guardian", desc: "Share your live route securely with chosen contacts. They can track you on a map until you arrive.", color: "from-blue-500 to-cyan-500" },
            { icon: <Lock />, title: "Cloud Vault", desc: "Instantly capture and encrypt audio/photos to a secure cloud server. Tamper-proof evidence.", color: "from-fuchsia-500 to-purple-500" },
            { icon: <Users />, title: "Trust Circle", desc: "Build a network of guardians who are instantly notified via push and SMS in emergencies.", color: "from-green-500 to-emerald-500" },
            { icon: <Shield />, title: "Fake UI Disguise", desc: "Appears as a normal calculator until you enter your secret PIN. Keeps the app hidden from aggressors.", color: "from-indigo-500 to-blue-500" },
            { icon: <Activity />, title: "Offline Fallback", desc: "Automatically sends SMS alerts with exact GPS coordinates if the internet disconnects.", color: "from-pink-500 to-rose-500" },
          ].map((feature, i) => (
            <div key={i} className={`group relative p-[1px] rounded-[2.5rem] overflow-hidden hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all duration-500 ${i === 0 || i === 4 ? 'lg:col-span-2' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-2xl`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-gradient-to-b from-[#11091F]/90 to-[#0A0514]/90 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 items-start">
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${feature.color} p-[1px] shadow-2xl`}>
                  <div className="w-full h-full bg-[#11091F] rounded-3xl flex items-center justify-center">
                    {React.cloneElement(feature.icon, { className: "w-7 h-7 text-white" })}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
                </div>
                <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-white/40 group-hover:text-white/90 transition-colors uppercase tracking-widest">
                  <CheckCircle2 className="w-5 h-5" /> Active Feature
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5. THE SOS TIMELINE */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 bg-[#11091F]/30 border-y border-white/5 my-12 md:my-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4">When every second counts.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg">Here is exactly what happens behind the scenes the moment you trigger the SOS alert.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-500/50 via-blue-500/50 to-transparent -translate-x-1/2 rounded-full" />
          
          {[
            { time: "00.0s", title: "SOS Triggered", desc: "You press the volume button 3 times or use your secret voice command. The app wakes up instantly, bypassing lock screens.", align: "right", color: "text-fuchsia-400", dot: "bg-fuchsia-500" },
            { time: "00.5s", title: "GPS Lock & Stealth Mode", desc: "Shevora silently locks onto your exact GPS coordinates. The screen turns black or returns to the calculator disguise so the aggressor suspects nothing.", align: "left", color: "text-blue-400", dot: "bg-blue-500" },
            { time: "01.0s", title: "Cloud Vault Recording", desc: "The microphone activates covertly. High-quality audio is recorded and streamed live to an encrypted cloud server, ensuring evidence is never lost even if the phone is destroyed.", align: "right", color: "text-purple-400", dot: "bg-purple-500" },
            { time: "02.5s", title: "Trust Circle Notified", desc: "Your 5 trusted contacts receive an overriding push notification alarm, bypassing their 'Do Not Disturb' settings, along with an SMS containing your live tracking link.", align: "left", color: "text-green-400", dot: "bg-green-500" },
            { time: "05.0s", title: "Admin Operations Center", desc: "The alert hits the centralized Shevora Admin Dashboard. Support agents can view your live route and audio feed to coordinate with local emergency services.", align: "right", color: "text-orange-400", dot: "bg-orange-500" },
          ].map((event, i) => (
            <div key={i} className={`relative flex items-center justify-between mb-8 md:mb-12 w-full ${event.align === "left" ? "md:flex-row-reverse" : ""}`}>
              {/* Timeline Dot */}
              <div className={`absolute left-6 md:left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full ${event.dot} border-[3px] md:border-4 border-[#0A0514] -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10`} />
              
              <div className="hidden md:block w-[45%]" /> {/* Spacer for desktop */}
              
              <div className="w-full pl-14 md:pl-0 md:w-[45%]">
                <div className={`p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md ${event.align === "left" ? "md:text-right" : "text-left"}`}>
                  <span className={`text-xl md:text-2xl font-black ${event.color} font-mono tracking-tighter`}>{event.time}</span>
                  <h4 className="text-lg md:text-xl font-bold text-white mt-1 md:mt-2 mb-1 md:mb-2">{event.title}</h4>
                  <p className="text-gray-400 leading-relaxed text-xs md:text-sm">{event.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4.6. FREQUENTLY ASKED QUESTIONS */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 mb-12 md:mb-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { q: "What happens if I lose internet connection?", a: "Shevora has an 'Offline Fallback' mechanism. If WiFi or mobile data fails, the app automatically switches to SMS mode and texts your GPS coordinates to your Trust Circle." },
            { q: "How does the Calculator disguise work?", a: "When you open the app, it looks and functions exactly like a standard calculator. To reveal the hidden SOS dashboard, you must type your secret PIN (Default is 8055) and press the '=' button. You can change this PIN anytime in the settings." },
            { q: "Can the attacker delete my recordings?", a: "No. Shevora uses a Cloud Vault system. The moment audio is recorded, it is encrypted and instantly uploaded to our secure servers. Even if the app is uninstalled or the phone is broken, the evidence remains safe on the cloud." },
            { q: "Is my location tracked all the time?", a: "Absolutely not. Privacy is our core principle. Your location is ONLY accessed and shared when you intentionally trigger an SOS alert or enable 'Live Guardian' mode during a trip." }
          ].map((faq, i) => (
            <div key={i} className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-default">
              <h4 className="text-base md:text-lg font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-fuchsia-500">Q.</span> {faq.q}
              </h4>
              <p className="text-sm md:text-base text-gray-400 pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0A0514] pt-16 md:pt-20 pb-8 md:pb-10 mt-10 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-1 sm:col-span-2 md:col-span-2 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden relative shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                <Image src="/logo.png" alt="Shevora" fill className="object-cover scale-[1.3]" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Shevora</h1>
            </div>
            <p className="text-sm md:text-base text-gray-400 max-w-sm">
              Empowering women through advanced technology. Your safety, disguised and protected 24/7.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-white mb-4 md:mb-6">Product</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-400">
              <li><button onClick={() => setIsModalOpen(true)} className="hover:text-white transition-colors">Download APK</button></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-white mb-4 md:mb-6">Legal</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 border-t border-white/10 text-center flex flex-col items-center gap-4">
          <p className="text-gray-500 text-xs md:text-sm">© 2026 Shevora Technologies. All rights reserved.</p>
        </div>
      </footer>

      {/* DOWNLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#11091F] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(217,70,239,0.2)]">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                <Lock className="w-8 h-8 text-fuchsia-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-center text-white mb-2">Important Notice!</h3>
            
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed mb-8">
              <p>For your absolute safety, Shevora uses a <strong>Calculator Disguise</strong>.</p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-fuchsia-500 font-bold">1.</span>
                    <span>When you first open the app, it will look exactly like a Calculator.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-fuchsia-500 font-bold">2.</span>
                    <span>Type the default PIN: <strong className="text-fuchsia-400 text-base">8055</strong> and press <strong className="text-white bg-white/10 px-1 rounded">=</strong> to unlock the SOS Dashboard.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-fuchsia-500 font-bold">3.</span>
                    <span><strong>Please change this PIN</strong> immediately in the Settings after you log in!</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href="/Shevora.apk" 
                download
                onClick={() => setIsModalOpen(false)}
                className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(217,70,239,0.4)]"
              >
                I Understand, Download Now
              </a>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}} />
    </div>
  );
}

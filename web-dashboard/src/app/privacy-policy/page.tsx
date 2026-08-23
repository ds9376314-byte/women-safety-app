import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0514] text-white font-sans selection:bg-fuchsia-500/30">
      <nav className="border-b border-white/5 bg-[#11091F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-fuchsia-500" />
            <span className="font-bold tracking-tight">Shevora Legal</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: August 2026</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to Shevora ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all users of our Shevora mobile application and website. Because our app deals with sensitive personal safety, privacy is our highest priority.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when registering for the app. This includes your name, email address, password, and the contact information of your "Trust Circle". 
              <br/><br/>
              <strong>Location Data:</strong> We do NOT track your location constantly. We only access your GPS coordinates when you actively trigger an SOS alert or use the Live Guardian feature.
              <br/><br/>
              <strong>Audio and Media:</strong> When an SOS is triggered, the app records audio. This data is strictly encrypted and uploaded to a secure cloud vault.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p>
              The information we collect is used strictly for your safety. We use your data to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Facilitate account creation and logon process.</li>
              <li>Send automated SOS alerts via SMS and push notifications to your Trust Circle.</li>
              <li>Provide live tracking to authorized contacts during emergencies.</li>
              <li>Store encrypted audio evidence securely in the cloud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing of Information</h2>
            <p>
              We <strong>never</strong> sell, trade, or rent your personal identification information to others. Your location data and audio recordings are only shared with the trusted contacts you explicitly select, or with emergency services through our Admin Operations Center in a verified crisis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Security of Your Information</h2>
            <p>
              We use state-of-the-art encryption protocols (including end-to-end encryption for sensitive data) to protect your personal information. Our cloud vault is highly secure and tamper-proof. However, please remember that no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, you may email us at ds9376314@gmail.com.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#0A0514] py-8 text-center text-sm text-gray-500">
        © 2026 Shevora Technologies. All rights reserved.
      </footer>
    </div>
  );
}

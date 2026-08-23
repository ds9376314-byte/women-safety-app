import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: August 2026</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              By downloading, accessing, or using the Shevora mobile application and website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of the App</h2>
            <p>
              Shevora is designed to be a personal safety utility. You agree to use the app only for its intended purpose of personal security and emergency alerting. You must not use the app to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Harass, stalk, or track individuals without their consent.</li>
              <li>Submit false SOS alerts intentionally to emergency services.</li>
              <li>Reverse engineer or attempt to breach the app's security protocols.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Accuracy of Data</h2>
            <p>
              While Shevora strives to provide accurate GPS tracking and instant alerts, we do not guarantee 100% accuracy or uptime. Network failures, hardware limitations on your mobile device, or strict battery optimization settings may delay or prevent alerts from being sent. We are not liable for any damages or harm that occur if an alert fails to send.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Accounts</h2>
            <p>
              You are responsible for safeguarding the password and PIN that you use to access Shevora. The Calculator Disguise feature relies on your PIN being kept secret from potential aggressors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Liability</h2>
            <p>
              Shevora is a supplementary safety tool and should not be a substitute for contacting formal emergency services (like 911 or local police). In no event shall Shevora Technologies, its directors, employees, or partners be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at ds9376314@gmail.com.
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

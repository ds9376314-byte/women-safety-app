import React from 'react';

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex-1 overflow-y-auto w-full h-full bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Community Safety Guidelines</h1>
        <div className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <p>Version: 1.0.0</p>
          <p>Effective Date: [LEGAL REVIEW REQUIRED]</p>
          <p>Last Updated: October 2023</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-4">SHEVORA's Community Safety feature relies on crowdsourced reporting to keep everyone safe. We require all users to adhere to these guidelines to maintain a helpful and secure environment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-700">What is Allowed</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Genuine safety concerns in a specific area.</li>
              <li>Reporting road hazards, dangerous locations, or poor lighting.</li>
              <li>Temporary hazards (e.g., severe flooding, protests affecting safety).</li>
              <li>Legitimate safety information that protects the community.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-red-700">What is NOT Allowed (Zero Tolerance)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fake reports or manipulated safety alerts.</li>
              <li>Doxxing (revealing private personal information of others).</li>
              <li>Harassment, threats, or hate content.</li>
              <li>False accusations against individuals.</li>
              <li>Spam or malicious reports.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Moderation</h2>
            <p className="mb-4">Reports violating these guidelines will be removed. Users who repeatedly violate these rules will face account suspension or permanent termination. Reporter identities are kept private and are not exposed publicly on reports.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

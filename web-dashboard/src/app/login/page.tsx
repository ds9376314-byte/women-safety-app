import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--color-surface)] rounded-3xl shadow-xl p-8 border border-[var(--color-border)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-rose-200">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">SHEVORA</h1>
          <p className="text-[var(--color-text-muted)] mt-2 text-center">Sign in to manage your safety network and monitor alerts.</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <input type="checkbox" className="rounded border-gray-300 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]" />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-[var(--color-secondary)] hover:underline">Forgot password?</a>
          </div>

          <Link href="/" className="w-full block text-center py-3 bg-[var(--color-secondary)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4">
            Sign In
          </Link>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
          Don't have an account? <a href="#" className="font-bold text-[var(--color-primary)] hover:underline">Create one</a>
        </p>

      </div>
    </div>
  );
}

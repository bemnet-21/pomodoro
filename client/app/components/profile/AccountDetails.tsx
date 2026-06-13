import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import type { UserProfile } from '@/app/types/profile';

interface AccountDetailsProps {
  user: UserProfile
  ;
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  return (
    <section className="bg-[#111] border border-[#1F1F1F] p-6 rounded-xl">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">
            Authentication
          </span>
          <h3 className="text-xl font-bold text-white">Account Details</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1.5">
            <User className="w-3 h-3" /> Username
          </label>
          <div className="bg-background border border-[#1F1F1F] px-4 py-2.5 rounded text-sm text-gray-200 font-medium">
            {user.username}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1.5">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <div className="bg-background border border-[#1F1F1F] px-4 py-2.5 rounded text-sm text-gray-200 font-medium">
            {user.email}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Member Since
          </label>
          <div className="bg-background border border-[#1F1F1F] px-4 py-2.5 rounded text-xs font-mono text-gray-400">
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#1F1F1F]">
        <button className="w-full flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-mono text-xs py-2.5 px-4 rounded transition-all">
          <Shield className="w-4 h-4" /> CHANGE PASSWORD
        </button>
      </div>
    </section>
  );
}
"use client";

import AccountDetails from '../components/profile/AccountDetails';
import TimerSettings from '../components/profile/TimerSettings';
import type { UserProfile, UserSettings } from '../types/profile';
import { getUserSettings, updateUserSettings } from '../api/user.service';
import useSWR from 'swr';
import { getProfile } from '../api/auth.service';


const DEFAULT_SETTINGS: UserSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};



export default function ProfilePage() {
  const { data: userData, error: userError, isLoading: userLoading } = useSWR('user', getProfile)
  const user: UserProfile = userData?.data?.user
  console.log("Fetched user profile:", user);

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    const res = await updateUserSettings(newSettings);
    if (res.status !== 200) {
      console.error("Failed to update settings:", res.statusText);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log("Settings successfully updated in MongoDB:", newSettings);
  };

  const { data: settingsData, error: settingsError, isLoading: settingsLoading } = useSWR('settings', getUserSettings)
  const settings: UserSettings = settingsData?.data?.data ?? settingsData?.data ?? DEFAULT_SETTINGS;
  console.log("Fetched user settings:", settings);

  

  return (
    <div className="min-h-screen bg-background text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <header className="mb-10">
          <span className="text-primary font-mono text-xs tracking-widest uppercase">Identity & Config</span>
          <h1 className="text-4xl font-bold tracking-tighter mt-2">User Profile</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <AccountDetails user={user} error={userError} isLoading={userLoading} />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <TimerSettings 
              key={`${settings.workDuration}-${settings.shortBreak}-${settings.longBreak}-${settings.longBreakInterval}-${settings.autoStartBreaks}-${settings.autoStartWork}`}
              settings={settings} 
              onSave={handleUpdateSettings} 
              error={settingsError}
              isLoading={settingsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
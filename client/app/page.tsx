"use client";
import { addSessionLog } from "./api/session.service";
import CounterCard from "./components/CounterCard";
import { NewLog } from "./components/history/HistoryDashboard";

export default function Home() {
  
  // This function acts as the bridge between the Timer UI and your Backend
  const handleSessionComplete = async (sessionPayload: NewLog) => {
    console.log("Session Ended! Payload generated:", sessionPayload);

   try {
      const res = await addSessionLog(sessionPayload);
      if (res.status === 201) {
        console.log("Session log successfully saved to MongoDB!");
      } else {
        console.error("API returned an error:", res.statusText);
      }
   } catch(err) {
      console.error("Error during session completion handling:", err);
   }
    
    if (sessionPayload.status === 'completed') {
      // Optional: Trigger a browser notification or a "Ding" sound here!
      new Audio('/bell.mp3').play().catch(() => {}); // Needs a bell.mp3 in public folder
      alert(`Awesome! You completed a ${sessionPayload.sessionType} session.`);
    } else {
      console.log("Session was abandoned.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background font-sans selection:bg-primary selection:text-white">
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="w-200 h-200 bg-primary opacity-[0.03] rounded-full blur-[120px]" />
      </div>

      {/* The Timer Card */}
      <div className="z-10 w-full flex justify-center">
        <CounterCard onSessionComplete={handleSessionComplete} />
      </div>
    </main>
  );
}
import { Play, RefreshCcw } from 'lucide-react'
import React from 'react'

const CounterCard = () => {
  return (
    <div className="w-[75%] h-120 bg-surface flex flex-col justify-between items-center border border-primary/30 rounded-lg px-4 py-16 shadow-[0_0_50px_rgba(255,77,0,0.22)]">
        <nav className="w-[30%] flex justify-between text-text-secondary/60 font-geist">
          <div className="text-text-primary">FOCUS</div>
          <div>BREAK</div>
          <div>LONG</div>
        </nav>
        <div className="flex flex-col items-center gap-y-4">
          <div className="text-8xl font-bold text-white font-mono">25:00</div>
          <div className="text-text-secondary">Architecting MERN Schemas</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative isolate w-fit p-5 rounded-full bg-primary cursor-pointer before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-primary/70 before:blur-md before:content-['']">
            <Play className="text-black" size={24} fill="currentColor" stroke="none" />
          </button>
          <button
            type="button"
            aria-label="Refresh timer"
            className="grid size-12 place-items-center rounded-full border border-primary/35 text-text-secondary transition hover:border-primary hover:text-primary"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>
  )
}

export default CounterCard

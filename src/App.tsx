import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

type Mode = "pomodoro" | "shortBreak" | "longBreak";

const MODES = {
  pomodoro: { label: "Pomodoro", time: 25 * 60, color: "bg-[#FF6B6B]" },
  shortBreak: { label: "Short Break", time: 5 * 60, color: "bg-[#4ECDC4]" },
  longBreak: { label: "Long Break", time: 15 * 60, color: "bg-[#45B7D1]" },
};

export default function App() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.time);
  const [isActive, setIsActive] = useState(false);

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(MODES[mode].time);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play sound here
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentColor = MODES[mode].color;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">
            Focus
          </h1>
          <button
            className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            aria-label="Settings"
          >
            <Settings size={24} />
          </button>
        </header>

        {/* Main Card */}
        <div
          className={`border-4 border-black ${currentColor} p-6 sm:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500`}
        >
          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-8">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 py-2 font-bold text-sm sm:text-base border-2 border-black rounded-full transition-all ${
                  mode === m
                    ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                }`}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border-4 border-black px-8 py-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-mono text-7xl sm:text-8xl font-bold tracking-tighter">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-6">
            <button
              onClick={toggleTimer}
              className={`flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${
                isActive ? "bg-[#FFD500]" : "bg-white"
              }`}
              aria-label={isActive ? "Pause" : "Start"}
            >
              {isActive ? (
                <Pause size={40} className="fill-black" />
              ) : (
                <Play size={40} className="fill-black ml-2" />
              )}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              aria-label="Reset"
            >
              <RotateCcw size={36} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center font-bold text-sm border-2 border-black bg-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto flex justify-center">
          STAY FOCUSED.
        </footer>
      </div>
    </div>
  );
}

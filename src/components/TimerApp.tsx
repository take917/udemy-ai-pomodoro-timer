"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Controls from "./Controls";
import MetadataUpdater from "./MetadataUpdater";
import TimerDisplay from "./TimerDisplay";
import { useEffect, useState } from "react";

import { playNotificationSound } from "@/utils/sound";

// タイマーのモードの型
type Mode = "work" | "break";

export default function TimerApp() {
  const [workDuration, setWorkDuration] = useState(25);
  // タイマーの状態
  const [isRunning, setIsRunning] = useState(false);
  // タイマーの残り時間の状態
  const [timeLeft, setTimeLeft] = useState({
    minutes: workDuration,
    seconds: 0,
  });

  const [mode, setMode] = useState<Mode>("work");

  const toggleMode = () => {
    // モードの切り替え
    const newMode = mode === "work" ? "break" : "work";
    setMode(newMode);
    // 作業モード２５分　休憩モード５分のタイマー
    setTimeLeft({ minutes: newMode === "work" ? workDuration : 5, seconds: 0 });

    // タイマーを停止
    setIsRunning(false);
  };

  //   開始・停止ボタン
  const handleStart = () => {
    setIsRunning(!isRunning);
  };
  //   リセットボタン
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft({
      minutes: mode === "work" ? workDuration : 5,
      seconds: 0,
    });
  };
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              setIsRunning(false);
              toggleMode();
              void playNotificationSound();
              return prev;
            }

            return { minutes: prev.minutes - 1, seconds: 59 };
          }

          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "work" ? "作業時間" : "休憩時間"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <TimerDisplay
            minutes={timeLeft.minutes}
            seconds={timeLeft.seconds}
            mode={mode}
          />
          <Controls
            onStart={handleStart}
            onReset={handleReset}
            onModeToggle={toggleMode}
            isRunning={isRunning}
          />
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <label className="text-sm font-medium">作業時間</label>
          <select
            value={workDuration}
            onChange={(e) => {
              const newDuration = parseInt(e.target.value);
              setWorkDuration(newDuration);
              if (mode === "work" && !isRunning) {
                setTimeLeft({ minutes: newDuration, seconds: 0 });
              }
            }}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 15, 30, 45, 60].map((minutes) => (
              <option value={minutes} key={minutes}>
                {minutes}分
              </option>
            ))}
          </select>
        </CardFooter>
      </Card>
      <MetadataUpdater
        minutes={timeLeft.minutes}
        seconds={timeLeft.seconds}
        mode={mode}
      />
    </div>
  );
}

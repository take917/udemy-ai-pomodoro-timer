"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimerDisplay from "./TimerDisplay";
import Controls from "./Controls";
import { useEffect, useState } from "react";

export default function TimerApp() {
  // タイマーの状態
  const [isRunning, setIsRunning] = useState(false);
  // タイマーの残り時間の状態
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 3 });
  //   開始・停止ボタン
  const handleStart = () => {
    setIsRunning(!isRunning);
  };
  //   リセットボタン
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft({ minutes: 25, seconds: 0 });
  };
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              setIsRunning(false);
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
            作業時間
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <TimerDisplay minutes={timeLeft.minutes} seconds={timeLeft.seconds} />
          <Controls
            onStart={handleStart}
            onReset={handleReset}
            isRunning={isRunning}
          />
        </CardContent>
      </Card>
    </div>
  );
}

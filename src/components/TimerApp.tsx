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
import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useRef } from "react";
import { useReward } from "react-rewards";
import { playNotificationSound } from "@/utils/sound";

// タイマーのモードの型
type Mode = "work" | "break";

export default function TimerApp() {
  const { reward: confetti, isAnimating } = useReward(
    "confettiReward",
    "confetti",
    {
      elementCount: 100,
      spread: 70,
      decay: 0.93,
      lifetime: 150,
    }
  );

  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  // タイマーの状態
  const [isRunning, setIsRunning] = useState(false);
  // タイマーの残り時間の状態
  const [timeLeft, setTimeLeft] = useState({
    minutes: workDuration,
    seconds: 0,
  });

  const [mode, setMode] = useState<Mode>("work");

  const [autoStart, setAutoStart] = useState(false);
  const toggleMode = () => {
    // モードの切り替え
    const newMode = mode === "work" ? "break" : "work";
    setMode(newMode);
    // 作業モード２５分　休憩モード５分のタイマー
    setTimeLeft({
      minutes: newMode === "work" ? workDuration : breakDuration,
      seconds: 0,
    });

    // タイマーを停止
    setIsRunning(autoStart);
  };

  //   開始・停止ボタン
  const handleStart = () => {
    setIsRunning(!isRunning);
  };
  //   リセットボタン
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft({
      minutes: mode === "work" ? workDuration : breakDuration,
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
              if (mode === "work") {
                void confetti();
              }

              void playNotificationSound();

              setTimeout(() => {
                toggleMode();
              }, 100);
              return prev;
            }

            return { minutes: prev.minutes - 1, seconds: 59 };
          }

          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <span
        id="confettiReward"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
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
        <CardFooter className="flex flex-col w-full gap-4 max-w-[200px] mx-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[4.5rem]">
              作業時間
            </label>
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
              {[5, 10, 15, 25, 30, 45, 60].map((minutes) => (
                <option value={minutes} key={minutes}>
                  {minutes}分
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[4.5rem]">
              休憩時間
            </label>
            <select
              value={breakDuration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setBreakDuration(newDuration);
                if (mode === "break" && !isRunning) {
                  setTimeLeft({ minutes: newDuration, seconds: 0 });
                }
              }}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 15].map((minutes) => (
                <option value={minutes} key={minutes}>
                  {minutes}分
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <label className="text-sm font-medium min-w-[4.5rem]">
              自動開始
            </label>
            <Switch
              checked={autoStart}
              onCheckedChange={() => setAutoStart(!autoStart)}
            />
          </div>
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

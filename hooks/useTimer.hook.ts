/* eslint-disable no-undef */
import { useState, useEffect } from 'react';

interface UseTimerReturn {
  formattedTime: string;
  start: () => void;
  reset: () => void;
}

const useTimer = (initialSeconds: number = 120): UseTimerReturn => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval!);
            setIsActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!isActive && seconds !== initialSeconds) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds, initialSeconds]);

  const start = () => setIsActive(true);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
  };

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    formattedTime: formatTime(seconds),
    start,
    reset,
  };
};

export default useTimer;

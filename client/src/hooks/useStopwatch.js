import { useEffect, useRef, useState } from "react";

export function useStopwatch(startingTime) {
  const [time, setTime] = useState(startingTime); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setTime(startingTime);
  };

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
  };
}

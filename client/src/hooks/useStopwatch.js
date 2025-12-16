import { useEffect, useRef, useState } from "react";

export function useStopwatch(startingTime, onFinish) {
  const [time, setTime] = useState(startingTime); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          // ⛔ stop at 0
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);

          // optional callback
          if (onFinish) onFinish();

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, onFinish]);

  const start = () => {
    if (time > 0) setIsRunning(true);
  };

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

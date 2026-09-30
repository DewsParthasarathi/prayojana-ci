import { useEffect, useRef, useState } from "react";

export const useCountdown = (seconds) => {
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    clearInterval(intervalRef.current);
    setRemaining(seconds);
    intervalRef.current = setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { remaining, isRunning: remaining > 0, start };
};

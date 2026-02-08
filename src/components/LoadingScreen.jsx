import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { state } from "../store";
import { useSnapshot } from "valtio";

export default function LoadingScreen() {
  const { progress } = useProgress();
  const { loaded } = useSnapshot(state);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--progress", Math.floor(progress));

    if (progress >= 100 && !loaded) {
      state.loaded = true;
      const timer = setTimeout(() => setHide(true), 900);
      return () => clearTimeout(timer);
    }
  }, [progress, loaded]);

  if (hide) return null;

  return (
    <div className={`loader ${loaded ? "done" : ""}`}>
      <svg className="loader-ring" viewBox="0 0 120 120">
        <circle className="track" />
        <circle className="fill" />
      </svg>
      <span className="loader-text">Loading</span>
    </div>
  );
}

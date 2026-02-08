import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { NeutralToneMapping } from "three";
import Scene from "./components/Scene";
import AnimateCamera from "./components/AnimateCamera";
import Clock from "./components/Clock";
import BackgroundImageCover from "./components/BackgroundImageCover";
import DynamicLights from "./components/DynamicLights";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import Settings from "./components/Settings";

const GL_CONFIG = {
  antialias: true,
  powerPreference: "high-performance",
  toneMappingExposure: 1.5,
  stencil: false,
  alpha: false,
  toneMapping: NeutralToneMapping,
};

const CAMERA_CONFIG = {
  near: 0.1,
  far: 50,
  fov: 5,
  position: [0, 0, 25],
};

export default function App() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
    setPlaying((p) => !p);
  }, []);

  return (
    <div className="app">
      <LoadingScreen />

      <audio ref={audioRef} src="/sound/music.mp3" loop preload="none" />

      <button
        className={`music-btn ${playing ? "playing" : ""}`}
        onClick={toggleMusic}
      >
        <span className="dot" />
        {playing ? "Pause" : "Sound"}
      </button>

      <Canvas gl={GL_CONFIG} camera={CAMERA_CONFIG} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Scene />
          <Clock />
          <Settings />
          <CustomCursor />
          <AnimateCamera />
          <DynamicLights />
          <BackgroundImageCover />
        </Suspense>
      </Canvas>
    </div>
  );
}

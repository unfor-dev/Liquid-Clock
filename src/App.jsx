import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

function App() {
  return (
    <div className="main-container">
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;

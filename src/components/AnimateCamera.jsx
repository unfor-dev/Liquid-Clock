import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { easing } from "maath";

export default function AnimateCamera() {
  const controlsRef = useRef();

  useFrame((s, delta) => {
    easing.damp(s.camera.position, "x", -s.pointer.x * 4.5, 0.7, delta);
    easing.damp(s.camera.position, "y", -s.pointer.y * 2.5, 0.7, delta);
    controlsRef.current?.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 0, 0]}
      dampingFactor={0.25}
      maxDistance={25}
      minDistance={20}
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={0.2}
      maxPolarAngle={1.7}
      makeDefault
    />
  );
}

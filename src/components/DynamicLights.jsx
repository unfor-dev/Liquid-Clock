import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default memo(function DynamicLights() {
  const ref = useRef();

  useFrame((s, delta) => {
    easing.damp3(
      ref.current.position,
      [s.pointer.x, s.pointer.y, -0.01],
      0.6,
      delta
    );
  });

  return (
    <directionalLight ref={ref} position={[0.4, 1, -0.2]} intensity={8} />
  );
})

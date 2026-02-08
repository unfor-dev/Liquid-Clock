import { Suspense, memo } from "react";
import { Environment } from "@react-three/drei";

export default memo(function Scene() {
  return (
    <Suspense fallback={null}>
      <Environment preset="warehouse" environmentIntensity={0.25} />
    </Suspense>
  );
})

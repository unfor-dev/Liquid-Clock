import { Center, Text3D, Text } from "@react-three/drei";
import { useState, useEffect, memo } from "react";
import { MeshPhysicalMaterial } from "three";
import { useSnapshot } from "valtio";
import { state } from "../store";

const FONT_JSON = "/fonts/Morganite_Medium.json";
const FONT_TTF = "/fonts/Morganite-ExtraLight.ttf";
const UPDATE_INTERVAL = 1000;

// Pre-created material — avoids re-creation on every time tick
const clockMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.23,
  transmission: 1,
  ior: 1.8,
  thickness: 2,
  reflectivity: 0.4,
  clearcoat: 0.2,
  clearcoatRoughness: 0.1,
  iridescence: 1,
  iridescenceIOR: 0.9,
  iridescenceThicknessRange: [233, 434],
  dispersion: 12,
});

function getTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default memo(function Clock() {
  const { isMobile, showSettings } = useSnapshot(state);
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), UPDATE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  if (showSettings) return null;

  const size = isMobile ? 0.7 : 1.2;
  const bevel = isMobile ? 0.012 : 0.016;

  return (
    <group>
      <Center key={time} position={[0, isMobile ? 0.3 : 0.2, 0]}>
        <Text3D
          size={size}
          letterSpacing={-0.005}
          height={0.08}
          bevelEnabled
          bevelSize={bevel}
          bevelSegments={3}
          bevelThickness={0.03}
          curveSegments={6}
          font={FONT_JSON}
          material={clockMaterial}
        >
          {time}
        </Text3D>
      </Center>

      <Center
        position={isMobile ? [0.17, 0.2, 0.05] : [0.2, -0.1, 0.05]}
      >
        <Text fontSize={0.2} anchorX="left" anchorY="middle" font={FONT_TTF}>
          Real Clock Liquid Glass
        </Text>
      </Center>
    </group>
  );
})

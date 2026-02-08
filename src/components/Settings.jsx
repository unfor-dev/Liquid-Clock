import {
  Billboard,
  Circle,
  Center,
  Plane,
  Sphere,
  Text,
  MeshDiscardMaterial,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MeshPhysicalMaterial } from "three";
import ConfigIcon from "./ConfigIcon";
import { useSnapshot } from "valtio";
import { state } from "../store";
import { useMemo, useRef, useState } from "react";

const FONT = "/fonts/Morganite-Medium.ttf";

const BG_OPTIONS = [
  { label: "1", value: "bg1" },
  { label: "2", value: "video2" },
  { label: "3", value: "bg2" },
];

const BUTTON_POSITIONS = [
  [-0.45, -0.5, -0.1],
  [-0.2, -0.5, -0.1],
  [0.05, -0.5, -0.1],
];

export default function Settings() {
  const { showSettings } = useSnapshot(state);

  return (
    <Billboard>
      {showSettings && (
        <>
          <Overlay />
          <BackgroundPicker />
          <ThicknessSlider />
        </>
      )}
      <ConfigIcon />
    </Billboard>
  );
}

function Overlay() {
  return (
    <Plane args={[20, 20]} position={[0, 0, -0.5]}>
      <meshBasicMaterial color="black" transparent opacity={0.5} />
    </Plane>
  );
}

function BackgroundPicker() {
  const glassMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "white",
        metalness: 0,
        roughness: 0.28,
        transmission: true,
        ior: 1.2,
        thickness: 0.5,
        dispersion: 12,
      }),
    []
  );

  return (
    <group position={[0, 0.2, 0]}>
      <Text
        fontSize={0.1}
        position={[0, -0.25, -0.1]}
        letterSpacing={0.02}
        font={FONT}
      >
        BACKGROUND OPTIONS
      </Text>

      <Center position={[0.45, -0.15, 0]}>
        {BG_OPTIONS.map((opt, i) => (
          <Sphere
            key={opt.label}
            args={[0.1, 16, 16]}
            scale={[1, 1, 0.35]}
            position={BUTTON_POSITIONS[i]}
            material={glassMat}
            onClick={() => (state.background = opt.value)}
          >
            <Text
              anchorX="center"
              anchorY="middle"
              font={FONT}
              position={[0, 0, 0.15]}
              fontSize={0.1}
            >
              {opt.label}
            </Text>
          </Sphere>
        ))}
      </Center>
    </group>
  );
}

function ThicknessSlider() {
  const { reflectivity } = useSnapshot(state);
  const [dragging, setDragging] = useState(false);
  const hitRef = useRef();
  const trackRef = useRef();
  const fillRef = useRef();
  const knobRef = useRef();

  const onDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    state.isDragging = true;
    setVal(e.point.x);
  };

  const onUp = () => {
    setDragging(false);
    state.isDragging = false;
  };

  const onMove = (e) => {
    if (!dragging) return;
    setVal(e.point.x);
  };

  const setVal = (x) => {
    state.reflectivity = Math.max(0, Math.min(1, x + 0.5));
  };

  useFrame(() => {
    if (!fillRef.current || !knobRef.current) return;
    const v = reflectivity;
    fillRef.current.scale.x = v;
    fillRef.current.position.x = (v - 1) * 0.5;
    knobRef.current.position.x = (v - 1) * 0.5 + v * 0.5;
  });

  return (
    <group position={[0, 0.2, -0.1]}>
      <Text
        fontSize={0.1}
        letterSpacing={0.02}
        position={[0, 0.625, -0.1]}
        font={FONT}
      >
        CURSOR GLASS THICKNESS: {reflectivity.toFixed(2)}
      </Text>

      <group position={[0, 0.5, 0]}>
        {/* Hit area */}
        <Plane
          args={[1.2, 0.2]}
          ref={hitRef}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerMove={onMove}
          onPointerLeave={onUp}
        >
          <MeshDiscardMaterial />
        </Plane>

        {/* Track bg */}
        <Plane
          args={[1, 0.05]}
          ref={trackRef}
          renderOrder={-1}
          position={[0, 0, -0.3]}
        >
          <meshBasicMaterial color="white" opacity={0.3} transparent />
        </Plane>

        {/* Fill */}
        <Plane
          ref={fillRef}
          args={[1, 0.05]}
          scale={[reflectivity, 1, 1]}
          position={[(reflectivity - 1) * 0.5, 0, -0.2]}
        >
          <meshBasicMaterial color="#cccccc" />
        </Plane>

        {/* Knob */}
        <Circle
          ref={knobRef}
          args={[0.05, 16]}
          position={[0, 0, -0.15]}
          visible={!dragging}
        >
          <meshBasicMaterial color="white" />
        </Circle>
      </group>
    </group>
  );
}

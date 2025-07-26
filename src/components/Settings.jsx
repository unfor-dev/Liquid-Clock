import {
  Billboard,
  Circle,
  Center,
  Plane,
  Sphere,
  Text,
  useTexture,
  MeshDiscardMaterial,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import ConfigIcon from "./ConfigIcon";
import { useSnapshot } from "valtio";
import { state } from "../store";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function Settings() {
  const { showSettings } = useSnapshot(state);

  return (
    <Billboard>
      {showSettings && (
        <>
          <BackgroundOptions />
          <ReflectivitySlider />
          <BackgroundOverlay />
        </>
      )}
      <ConfigIcon />
    </Billboard>
  );
}

function BackgroundOverlay() {
  return (
    <Plane args={[20, 20]} position={[0, 0, -0.5]}>
      <meshBasicMaterial color="black" transparent opacity={0.5} />
    </Plane>
  );
}

function BackgroundOptions() {
  const { isMobile } = useSnapshot(state);
  const buttonsMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "white",
    metalness: 0,
    roughness: 0.28,
    transmission: true,
    ior: 1.2,
    thickness: 0.5,
    dispersion: 12,
  }), []);

  const buttonPositions = [
    [-0.45, -0.5, -0.1], // 1
    [-0.2, -0.5, -0.1],  // 2
    [0.05, -0.5, -0.1],  // 3
    [-0.45, -0.25, -0.1], // 4
    [-0.2, -0.25, -0.1],  // 5
    [0.05, -0.25, -0.1],  // 6
  ];

  return (
    <group position={isMobile ? [0, 0.2, 0] : [0, 0.2, 0]}>
      <Text
        fontSize={0.1}
        position={[0, -0.25, -0.1]}
        letterSpacing={0.02}
        font="fonts/Morganite-Medium.ttf"
      >
        BACKGROUND OPTIONS
      </Text>
      <Center position={[0.45, -0.15, 0]}>
        {[1, 2, 3].map((num, i) => (
          <BackgroundButton
            key={num}
            number={num}
            position={buttonPositions[i]}
            onClick={() => (state.background = `video${num}`)}
            material={buttonsMaterial}
          />
        ))}
      </Center>
    </group>
  );
}

function BackgroundButton({ number, position, onClick, material }) {
  return (
    <Sphere
      args={[0.1, 32, 32]}
      scale={[1, 1, 0.35]}
      position={position}
      material={material}
      onClick={onClick}
    >
      <Text
        anchorX="center"
        anchorY="middle"
        font="fonts/Morganite-Medium.ttf"
        position={[0, 0, 0.15]}
        fontSize={0.1}
      >
        {number}
      </Text>
    </Sphere>
  );
}

function ReflectivitySlider() {
  const { reflectivity, isMobile } = useSnapshot(state);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef();
  const planeRef = useRef();
  const circleRef = useRef();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    state.isDragging = true;
    updateReflectivity(e.point.x);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    state.isDragging = false;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateReflectivity(e.point.x);
  };

  const updateReflectivity = (xPos) => {
    const newValue = Math.max(0, Math.min(1, xPos + 0.5));
    state.reflectivity = newValue;
  };

  useFrame(() => {
    if (!sliderRef.current || !planeRef.current) return;
    
    planeRef.current.scale.x = reflectivity;
    planeRef.current.position.x = (reflectivity - 1) * 0.5;
    circleRef.current.position.x = (reflectivity - 1) * 0.5 + reflectivity * 0.5;
  });

  return (
    <group position={isMobile ? [0, 0.2, -0.1] : [0, 0.2, -0.1]}>
      <Text
        fontSize={0.1}
        letterSpacing={0.02}
        position={[0, 0.625, -0.1]}
        font="fonts/Morganite-Medium.ttf"
      >
        CURSOR GLASS THICKNESS: {reflectivity.toFixed(2)}
      </Text>
      <group position={[0, 0.5, 0]}>
        <Plane
          args={[1.2, 0.2]}
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerUp}
        >
          <MeshDiscardMaterial />
        </Plane>

        <Plane
          args={[1, 0.05]}
          ref={sliderRef}
          renderOrder={-1}
          position={[0, 0, -0.3]}
        >
          <meshBasicMaterial color="white" opacity={0.3} transparent />
        </Plane>

        <Plane
          ref={planeRef}
          args={[1, 0.05]}
          scale={[reflectivity, 1, 1]}
          position={[(reflectivity - 1) * 0.5, 0, -0.2]}
        >
          <meshBasicMaterial color="#cccccc" />
        </Plane>

        <Circle
          ref={circleRef}
          args={[0.05, 32]}
          position={[0, 0, -0.15]}
          visible={!isDragging}
        >
          <meshBasicMaterial color="white" />
        </Circle>
      </group>
    </group>
  );
}
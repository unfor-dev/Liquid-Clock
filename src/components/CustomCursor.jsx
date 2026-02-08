import { Capsule, MeshTransmissionMaterial, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useSnapshot } from "valtio";
import { state } from "../store";

const GSAP_CONFIG = { duration: 1.5, ease: "elastic(1, 0.3)" };
const HALF_PI = Math.PI / 2;

// Reduced segments: 16 instead of 32 — cursor is small, no visual difference
const CAPSULE_IDLE = [0.1, 0.3, 16, 16];
const CAPSULE_DRAG = [0.08, 0.1, 16, 16];
const SPHERE_ARGS = [0.1, 16, 16];

export default function CustomCursor() {
  const groupRef = useRef();
  const [pressed, setPressed] = useState(false);
  const { hovered, reflectivity, isDragging } = useSnapshot(state);

  useFrame((s) => {
    groupRef.current.position.set(
      s.pointer.x * (s.viewport.width / 2),
      s.pointer.y * (s.viewport.height / 2),
      0.1
    );
  });

  const active = pressed || hovered;

  useEffect(() => {
    const target = groupRef.current.scale;

    if (active && isDragging) {
      gsap.to(target, { x: 1, y: 1, z: 0.1, ...GSAP_CONFIG });
    } else if (active) {
      gsap.to(target, { x: 1.7, y: 1.7, z: 0.2, ...GSAP_CONFIG });
    } else {
      gsap.to(target, { x: 1, y: 1, z: 0.75, ...GSAP_CONFIG });
    }
  }, [active, isDragging]);

  const onDown = useCallback(() => setPressed(true), []);
  const onUp = useCallback(() => setPressed(false), []);

  useEffect(() => {
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onDown, onUp]);

  const material = useMemo(
    () => (
      <MeshTransmissionMaterial
        color="white"
        metalness={0}
        roughness={0.01}
        ior={1.8}
        thickness={reflectivity}
        reflectivity={reflectivity}
        chromaticAberration={0.1}
        clearcoat={0.4}
        resolution={256}
        clearcoatRoughness={0.05}
        iridescence={0.9}
        iridescenceIOR={0.1}
        iridescenceThicknessRange={[0, 140]}
        samples={2}
      />
    ),
    [reflectivity]
  );

  const capsuleArgs = isDragging ? CAPSULE_DRAG : CAPSULE_IDLE;

  return (
    <group ref={groupRef}>
      <Capsule
        args={capsuleArgs}
        position={[0, 0, 0.1]}
        rotation={[0, 0, -HALF_PI]}
        visible={active || isDragging}
      >
        {material}
      </Capsule>

      <Sphere
        scale={[1, 1, 0.12]}
        args={SPHERE_ARGS}
        position={[0, 0, 0.1]}
        visible={!active && !isDragging}
      >
        {material}
      </Sphere>
    </group>
  );
}

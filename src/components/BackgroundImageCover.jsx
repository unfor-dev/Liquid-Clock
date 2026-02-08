import { useEffect, useRef, useLayoutEffect } from "react";
import { extend, useThree } from "@react-three/fiber";
import { shaderMaterial, useTexture, useVideoTexture } from "@react-three/drei";
import { Vector2 } from "three";
import { useSnapshot } from "valtio";
import { state } from "../store";

/* ── Shared shaders ── */
const VERT = /*glsl*/ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = (darken) => /*glsl*/ `
  uniform sampler2D map;
  uniform vec2 viewportRes;
  uniform vec2 mediaRes;
  varying vec2 vPos;

  void main() {
    float vAspect = viewportRes.x / viewportRes.y;
    float mAspect = mediaRes.x / mediaRes.y;
    vec2 uv = (vPos + 1.0) * 0.5;

    if (mAspect > vAspect) {
      float s = vAspect / mAspect;
      uv.x = uv.x * s + (1.0 - s) * 0.5;
    } else {
      float s = mAspect / vAspect;
      uv.y = uv.y * s + (1.0 - s) * 0.25;
    }

    vec4 tex = texture2D(map, clamp(uv, 0.0, 1.0));
    gl_FragColor = vec4(mix(tex.rgb, vec3(0.0), ${darken}), 1.0);
  }
`;

const defaultUniforms = {
  map: null,
  viewportRes: new Vector2(window.innerWidth, window.innerHeight),
  mediaRes: new Vector2(20, 10),
};

const VideoCoverMat = shaderMaterial(defaultUniforms, VERT, frag("0.3"));
const ImageCoverMat = shaderMaterial({ ...defaultUniforms }, VERT, frag("0.2"));

extend({ VideoCoverMat, ImageCoverMat });

/* ── Hook: sync material + mesh to viewport ── */
function useCoverSetup(texture, viewport) {
  const matRef = useRef();
  const meshRef = useRef();

  useLayoutEffect(() => {
    if (matRef.current) {
      matRef.current.viewportRes.set(viewport.width, viewport.height);
      if (texture) matRef.current.map = texture;
    }
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width / 1.5, viewport.height / 1.5, 1);
    }
  }, [viewport.width, viewport.height, texture]);

  useEffect(() => {
    if (matRef.current && texture) matRef.current.map = texture;
  }, [texture]);

  return { matRef, meshRef };
}

/* ── Video bg ── */
function VideoBackground() {
  const { viewport } = useThree();
  const tex = useVideoTexture("/video_demo2.mp4", { muted: true, loop: true });
  const { matRef, meshRef } = useCoverSetup(tex, viewport);

  return (
    <mesh position={[0, 0, -1.5]} ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2.5, 2.5, 1, 1]} />
      <videoCoverMat ref={matRef} depthWrite={false} />
    </mesh>
  );
}

/* ── Image bg ── */
function ImageBackground({ name }) {
  const { viewport } = useThree();
  const tex = useTexture(`/${name}.jpg`);
  const { matRef, meshRef } = useCoverSetup(tex, viewport);

  return (
    <mesh position={[0, 0, -1.5]} ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2.5, 2.5, 1, 1]} />
      <imageCoverMat ref={matRef} depthWrite={false} />
    </mesh>
  );
}

/* ── Switcher ── */
export default function BackgroundImageCover() {
  const { background } = useSnapshot(state);

  return background === "video2" ? (
    <VideoBackground />
  ) : (
    <ImageBackground name={background} />
  );
}

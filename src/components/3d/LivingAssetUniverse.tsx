"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

// --- Organic Particle Cloud & Flowing Mesh ---
function OrganicParticles({ bgState }: { bgState: string }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);
  const count = 750;

  // Generate organic natural node positions
  const [positions, initialPositions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const baseColor = new THREE.Color("#8fa89b"); // sage
    const earthColor = new THREE.Color("#c5a059"); // gold
    const mossColor = new THREE.Color("#446150"); // moss
    const tealColor = new THREE.Color("#2d5a52"); // subtle teal

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Cylindrical / organic natural spread
      const radius = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 32;

      pos[i3] = Math.cos(theta) * radius;
      pos[i3 + 1] = y;
      pos[i3 + 2] = Math.sin(theta) * radius;

      initPos[i3] = pos[i3];
      initPos[i3 + 1] = pos[i3 + 1];
      initPos[i3 + 2] = pos[i3 + 2];

      spd[i3] = (Math.random() - 0.5) * 0.015;
      spd[i3 + 1] = 0.005 + Math.random() * 0.012; // slow upward drift like spores/stream
      spd[i3 + 2] = (Math.random() - 0.5) * 0.015;

      // Color variation: mostly sage & moss with gentle gold sparks
      const rVal = Math.random();
      const chosenColor = rVal > 0.85 ? earthColor : rVal > 0.5 ? baseColor : rVal > 0.25 ? mossColor : tealColor;
      col[i3] = chosenColor.r;
      col[i3 + 1] = chosenColor.g;
      col[i3 + 2] = chosenColor.b;
    }
    return [pos, initPos, spd, col];
  }, [count]);

  // Network connection lines between close nodes
  const linePositions = useMemo(() => {
    const maxLines = 180;
    const lPos = new Float32Array(maxLines * 6);
    return lPos;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = state.clock.getElapsedTime();

    // Mouse parallax reaction
    const mouseX = state.mouse.x * 2.5;
    const mouseY = state.mouse.y * 2.5;

    let lineIndex = 0;
    const maxLineSegments = 180;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Organic fluid motion
      const wave = Math.sin(time * 0.5 + initialPositions[i3] * 0.15) * 0.4;
      const flow = Math.cos(time * 0.35 + initialPositions[i3 + 2] * 0.15) * 0.4;

      if (bgState === "searching") {
        // Converge inward like a vortex of information
        const dist = Math.sqrt(posAttr.array[i3] ** 2 + posAttr.array[i3 + 2] ** 2);
        if (dist > 3) {
          posAttr.array[i3] -= (posAttr.array[i3] / dist) * 0.04;
          posAttr.array[i3 + 2] -= (posAttr.array[i3 + 2] / dist) * 0.04;
        }
      } else if (bgState === "results") {
        // Expand into structured equilibrium
        posAttr.array[i3] += (initialPositions[i3] * 1.15 - posAttr.array[i3]) * 0.02;
        posAttr.array[i3 + 1] += (initialPositions[i3 + 1] - posAttr.array[i3 + 1]) * 0.02;
        posAttr.array[i3 + 2] += (initialPositions[i3 + 2] * 1.15 - posAttr.array[i3 + 2]) * 0.02;
      } else if (bgState === "recovery") {
        // Upward golden river flow
        posAttr.array[i3 + 1] += speeds[i3 + 1] * 2.5;
        if (posAttr.array[i3 + 1] > 18) posAttr.array[i3 + 1] = -18;
      } else {
        // Default serene living movement
        posAttr.array[i3] = initialPositions[i3] + wave + mouseX * 0.4;
        posAttr.array[i3 + 1] += speeds[i3 + 1];
        if (posAttr.array[i3 + 1] > 18) posAttr.array[i3 + 1] = -18;
        posAttr.array[i3 + 2] = initialPositions[i3 + 2] + flow + mouseY * 0.4;
      }

      // Compute dynamic proximity links
      if (lineIndex < maxLineSegments && i % 4 === 0) {
        for (let j = i + 1; j < Math.min(i + 15, count); j++) {
          const j3 = j * 3;
          const dx = posAttr.array[i3] - posAttr.array[j3];
          const dy = posAttr.array[i3 + 1] - posAttr.array[j3 + 1];
          const dz = posAttr.array[i3 + 2] - posAttr.array[j3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz;

          if (d2 < 18) {
            const lIdx = lineIndex * 6;
            linePositions[lIdx] = posAttr.array[i3];
            linePositions[lIdx + 1] = posAttr.array[i3 + 1];
            linePositions[lIdx + 2] = posAttr.array[i3 + 2];
            linePositions[lIdx + 3] = posAttr.array[j3];
            linePositions[lIdx + 4] = posAttr.array[j3 + 1];
            linePositions[lIdx + 5] = posAttr.array[j3 + 2];
            lineIndex++;
            if (lineIndex >= maxLineSegments) break;
          }
        }
      }
    }

    posAttr.needsUpdate = true;

    if (lineRef.current) {
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Circular soft blurred texture
  const particleTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(240, 245, 240, 0.8)");
      gradient.addColorStop(0.7, "rgba(143, 168, 155, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      {/* Particle Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.24}
          vertexColors
          transparent
          opacity={0.75}
          map={particleTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Organic Dynamic Synapses */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6e8a7c"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// --- Subtle Living Ambient Camera Rig ---
function CameraRig({ bgState }: { bgState: string }) {
  const { camera } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const mouseX = state.mouse.x * 1.2;
    const mouseY = state.mouse.y * 0.8;

    let targetZ = 16;
    let targetY = 0;

    if (bgState === "searching") {
      targetZ = 12; // zoom in on search
    } else if (bgState === "results") {
      targetZ = 18;
      targetY = 1.5;
    } else if (bgState === "recovery") {
      targetZ = 14;
      targetY = -1;
    }

    vec.set(mouseX, targetY + mouseY, targetZ);
    camera.position.lerp(vec, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// --- Main LivingAssetUniverse Export ---
export default function LivingAssetUniverse() {
  const bgState = useAppStore((s) => s.bgState);
  const lowBandwidthMode = useAppStore((s) => s.lowBandwidthMode);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || lowBandwidthMode) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#060a08] bg-forest-mesh bg-cover" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#060a08]">
      {/* Ambient gradient backdrops */}
      <div className="absolute inset-0 bg-radial-subtle opacity-70" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-moss-700/20 rounded-full blur-[140px] animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-ocean-800/15 rounded-full blur-[160px]" />
      
      <Canvas
        camera={{ position: [0, 0, 16], fov: 55 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <OrganicParticles bgState={bgState} />
        <CameraRig bgState={bgState} />
      </Canvas>
    </div>
  );
}

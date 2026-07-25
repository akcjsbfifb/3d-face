"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SparkRenderer, SplatMesh, SplatFileType } from "@sparkjsdev/spark";

const YAW_LIMIT = 0.45;
const PITCH_LIMIT = 0.3;
const DAMPING = 0.08;
const SPLAT_URL = "/face.splat";

type FaceSplatCanvasProps = {
  active: boolean;
  onProgress?: (value: number) => void;
  onReady?: () => void;
  onError?: (message: string) => void;
};

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

/**
 * Proven framing from the legacy viewer:
 * - SplatMesh from /face.splat
 * - quaternion (1,0,0,0) OpenCV to OpenGL
 * - position (0,0,-3), camera (0,0,3) looking at the splat
 * Mouse look is applied on top of that base orientation, driven by
 * pointer position over the whole window so the hero text does not
 * block the interaction.
 */
export function FaceSplatCanvas({
  active,
  onProgress,
  onReady,
  onError,
}: FaceSplatCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const targetRotationRef = useRef({ yaw: 0, pitch: 0 });
  const currentRotationRef = useRef({ yaw: 0, pitch: 0 });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  }, [onProgress, onReady, onError]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let splatMesh: SplatMesh | null = null;

    const mobile = isMobileDevice();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b0f);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 1000);
    camera.position.set(0, 0, 3);

    const baseOrientation = new THREE.Quaternion(1, 0, 0, 0);
    const lookEuler = new THREE.Euler(0, 0, 0, "YXZ");
    const lookOrientation = new THREE.Quaternion();

    const resize = () => {
      if (!renderer || !container) return;
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;
      const nx = (clientX / w) * 2 - 1;
      const ny = -((clientY / h) * 2 - 1);
      targetRotationRef.current = {
        yaw: THREE.MathUtils.clamp(nx * YAW_LIMIT, -YAW_LIMIT, YAW_LIMIT),
        pitch: THREE.MathUtils.clamp(
          ny * PITCH_LIMIT,
          -PITCH_LIMIT,
          PITCH_LIMIT,
        ),
      };
    };

    const onPointerMove = (e: PointerEvent) =>
      updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const animate = () => {
      if (!renderer || !splatMesh) return;

      if (activeRef.current && !reduceMotion) {
        const target = targetRotationRef.current;
        const current = currentRotationRef.current;
        current.yaw += (target.yaw - current.yaw) * DAMPING;
        current.pitch += (target.pitch - current.pitch) * DAMPING;

        lookEuler.set(current.pitch, current.yaw, 0);
        lookOrientation.setFromEuler(lookEuler);
        splatMesh.quaternion.copy(baseOrientation).multiply(lookOrientation);
      }

      camera.lookAt(0, 0, -3);
      renderer.render(scene, camera);
    };

    const init = async () => {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !mobile,
          alpha: false,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5),
        );
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        container.appendChild(renderer.domElement);
        resize();

        const spark = new SparkRenderer({ renderer });
        scene.add(spark);

        splatMesh = new SplatMesh({
          url: SPLAT_URL,
          fileType: SplatFileType.SPLAT,
          onProgress: (event: ProgressEvent) => {
            if (event.lengthComputable && event.total > 0) {
              onProgressRef.current?.(event.loaded / event.total);
            }
          },
        });
        splatMesh.quaternion.copy(baseOrientation);
        splatMesh.position.set(0, 0, -3);
        scene.add(splatMesh);

        await splatMesh.initialized;
        if (disposed) return;

        onProgressRef.current?.(1);
        onReadyRef.current?.();

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("touchmove", onTouchMove, { passive: true });

        renderer.setAnimationLoop(animate);

        return () => {
          ro.disconnect();
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("touchmove", onTouchMove);
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Splat failed";
        console.error("[splat]", message, err);
        onErrorRef.current?.(message);
      }
    };

    let cleanupListeners: (() => void) | undefined;
    void init().then((cleanup) => {
      cleanupListeners = cleanup;
    });

    return () => {
      disposed = true;
      cleanupListeners?.();
      renderer?.setAnimationLoop(null);
      splatMesh?.dispose();
      renderer?.dispose();
      if (renderer?.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full touch-none"
      aria-hidden
    />
  );
}

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export const Globe = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let phi = 0;
    let globe = null;

    const initGlobe = () => {
      if (!canvasRef.current || !containerRef.current) return;

      const width = containerRef.current.offsetWidth || 400;

      if (globe) {
        globe.destroy();
      }

      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 2,
        baseColor: [0.1, 0.4, 0.8],
        markerColor: [0.2, 0.6, 0.2],
        glowColor: [0.3, 0.5, 0.9],
        markers: [],
        scale: 1,
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phi += 0.005;
          }
          state.phi = phi + pointerInteractionMovement.current;
        },
      });

      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    };

    const timeout = setTimeout(initGlobe, 100);

    const handleResize = () => {
      initGlobe();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeout);
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        aspectRatio: "1",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
};

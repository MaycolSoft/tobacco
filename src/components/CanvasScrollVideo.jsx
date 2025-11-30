import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CanvasScrollVideo() {
  const canvasRef = useRef(null);
  const frameRef = useRef({ index: 0 });

  // 🔥 AUTOMATIC FRAME COUNT (WebP)
  // const frames = import.meta.glob("/public/frames/*.webp", { eager: true });

  const CDN = "https://cdn.mbsoft.freeddns.org";
  const frameCount = 1701;

  const imgPath = (i) =>
    `${CDN}/frame_${String(i).padStart(4, "0")}.webp`;

  function drawContain(ctx, img, canvas) {
    const cW = canvas.width;
    const cH = canvas.height;

    const iW = img.width;
    const iH = img.height;

    const cRatio = cW / cH;
    const iRatio = iW / iH;

    let w, h;

    if (iRatio < cRatio) {
      h = cH;
      w = (iW * cH) / iH;
    } else {
      w = cW;
      h = (iH * cW) / iW;
    }

    const x = (cW - w) / 2;
    const y = (cH - h) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, x, y, w, h);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();
    window.addEventListener("resize", setSize);

    // Load all frames (next step = progressive)
    const images = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = imgPath(i);
      images.push(img);
    }

    images[0].onload = () => {
      drawContain(ctx, images[0], canvas);
    };

    const frame = frameRef.current;

    gsap.to(frame, {
      index: frameCount - 1,
      snap: "index",
      ease: "none",
      scrollTrigger: {
        trigger: canvasRef.current.parentElement,
        scrub: 1,
        start: "top top",
        end: "bottom bottom",
      },
      onUpdate: () => {
        const img = images[frame.index];
        if (img) drawContain(ctx, img, canvas);
      },
    });


    return () => window.removeEventListener("resize", setSize);
  }, []);

  return (
    <div style={{ height: "400vh" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "black",
        }}
      />
    </div>
  );
}

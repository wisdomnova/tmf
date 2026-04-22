"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

type SignaturePadProps = {
  onChange: (value: string) => void;
  height?: number;
  displayHeightClass?: string;
};

export default function SignaturePad({
  onChange,
  height = 220,
  displayHeightClass = "h-[220px]",
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    canvas.setPointerCapture(event.pointerId);
    setDrawing(true);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.strokeStyle = "#f8b400";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.stroke();
    onChange(canvas.toDataURL("image/png"));
  }

  function stop() {
    setDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-[#f4d6c2] bg-[#fff8f4] p-3 text-xs leading-relaxed text-[#8a4b22]">
        Please sign clearly inside the box. Signature is required to complete
        check-in confirmation.
      </div>
      <canvas
        ref={canvasRef}
        width={1400}
        height={height}
        className={`w-full touch-none rounded-xl border border-[#e8d9cf] bg-white shadow-inner ${displayHeightClass}`}
        onPointerDown={start}
        onPointerMove={draw}
        onPointerUp={stop}
        onPointerLeave={stop}
      />
      <motion.button
        type="button"
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 cursor-pointer"
        onClick={clearSignature}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Clear signature
      </motion.button>
    </div>
  );
}

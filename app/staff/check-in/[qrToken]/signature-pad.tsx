"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";

type SignaturePadProps = {
  onChange: (value: string) => void; // Callback when signature changes
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
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
        Please sign clearly inside the box. Signature is required to complete
        check-in confirmation.
      </div>
      <canvas
        ref={canvasRef}
        width={1400}
        height={height}
        className={`w-full touch-none rounded-xl border border-gray-200 bg-white shadow-inner ${displayHeightClass}`}
        onPointerDown={start}
        onPointerMove={draw}
        onPointerUp={stop}
        onPointerLeave={stop}
      />
      <motion.button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        onClick={clearSignature}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }} // Add interactive hover/tap effects
      >
        <IconX size={16} />
        Clear signature
      </motion.button>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface PatternLockProps {
  onChange: (pattern: string) => void;
  size?: number;
}

export const PatternLock: React.FC<PatternLockProps> = ({
  onChange,
  size = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const pointRadius = size / 20;
  const gridSize = 3;
  const padding = size / 10;
  const points = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    x: padding + (i % gridSize) * ((size - 2 * padding) / (gridSize - 1)),
    y: padding + Math.floor(i / gridSize) * ((size - 2 * padding) / (gridSize - 1)),
    index: i
  }));

  const resetPattern = () => {
    setPattern([]);
    setIsDrawing(false);
    setCurrentPoint(null);
    onChange('');
    setShowResetConfirm(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    const drawPoint = (x: number, y: number, isSelected: boolean, isStart: boolean = false, isEnd: boolean = false) => {
      // Draw main circle
      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#4F46E5' : '#E5E7EB';
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#4338CA' : '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw start indicator (green circle)
      if (isStart) {
        ctx.beginPath();
        ctx.arc(x, y, pointRadius * 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw end indicator (red circle)
      if (isEnd) {
        ctx.beginPath();
        ctx.arc(x, y, pointRadius * 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const drawLine = (fromX: number, fromY: number, toX: number, toY: number) => {
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw points
    points.forEach((point, index) => {
      const isStart = pattern.length > 0 && pattern[0] === point.index;
      const isEnd = pattern.length > 0 && pattern[pattern.length - 1] === point.index;
      drawPoint(point.x, point.y, pattern.includes(point.index), isStart, isEnd);
    });

    // Draw lines between selected points
    for (let i = 0; i < pattern.length - 1; i++) {
      const current = points[pattern[i]];
      const next = points[pattern[i + 1]];
      drawLine(current.x, current.y, next.x, next.y);
    }

    // Draw line to current point if drawing
    if (isDrawing && currentPoint && pattern.length > 0) {
      const lastPoint = points[pattern[pattern.length - 1]];
      drawLine(lastPoint.x, lastPoint.y, currentPoint.x, currentPoint.y);
    }
  }, [size, pattern, isDrawing, currentPoint]);

  const getPointAtPosition = (x: number, y: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    return points.find(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - canvasX, 2) + Math.pow(point.y - canvasY, 2)
      );
      return distance < pointRadius;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getPointAtPosition(e.clientX, e.clientY);
    if (point && !pattern.includes(point.index)) {
      setPattern([point.index]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoint({ x, y });

    const point = getPointAtPosition(e.clientX, e.clientY);
    if (point && !pattern.includes(point.index)) {
      setPattern(prev => [...prev, point.index]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setCurrentPoint(null);
    if (pattern.length > 0) {
      onChange(pattern.join('-'));
    }
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCurrentPoint(null);
      if (pattern.length > 0) {
        onChange(pattern.join('-'));
      }
    }
  };

  return (
    <div className="inline-block border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border-2 border-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">Point de départ</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border-2 border-red-500 mr-2"></div>
          <span className="text-sm text-gray-600">Point d'arrivée</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="touch-none"
        style={{ cursor: 'pointer' }}
      />
      {pattern.length > 0 && (
        <div className="mt-4 flex justify-end">
          {showResetConfirm ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confirmer la réinitialisation ?</span>
              <button
                onClick={resetPattern}
                className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Oui
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Non
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};
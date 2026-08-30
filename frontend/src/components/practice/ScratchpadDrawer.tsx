'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ScratchpadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadDrawer: React.FC<ScratchpadDrawerProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [activeTab, setActiveTab] = useState<'draw' | 'notes'>('draw');
  const [notes, setNotes] = useState('');

  // Setup canvas resolution and restore state
  useEffect(() => {
    if (!isOpen || activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If we have saved history, redraw
    if (historyStep >= 0 && history[historyStep]) {
      ctx.putImageData(history[historyStep], 0, 0);
    } else {
      // Background fill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      saveState();
    }
  }, [isOpen, activeTab]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(history[newStep], 0, 0);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `scratchpad-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        height: '520px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✏️</span>
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
            Interactive Scratchpad
          </span>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#e5e7eb', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeTab === 'draw' ? '#ffffff' : 'transparent',
              color: activeTab === 'draw' ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            Draw / Math
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeTab === 'notes' ? '#ffffff' : 'transparent',
              color: activeTab === 'notes' ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            Type Notes
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px',
          }}
          title="Close Scratchpad"
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'draw' ? (
          <>
            {/* Toolbar */}
            <div
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setTool('pen')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: tool === 'pen' ? '#2563eb' : '#e5e7eb',
                    backgroundColor: tool === 'pen' ? '#eff6ff' : '#ffffff',
                    color: tool === 'pen' ? '#1d4ed8' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Pen
                </button>
                <button
                  type="button"
                  onClick={() => setTool('eraser')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: tool === 'eraser' ? '#2563eb' : '#e5e7eb',
                    backgroundColor: tool === 'eraser' ? '#eff6ff' : '#ffffff',
                    color: tool === 'eraser' ? '#1d4ed8' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Eraser
                </button>

                {/* Color swatches */}
                {['#2563eb', '#dc2626', '#16a34a', '#111827'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setColor(c);
                      setTool('pen');
                    }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: color === c && tool === 'pen' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    title={`Color ${c}`}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyStep <= 0}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: historyStep <= 0 ? '#9ca3af' : '#374151',
                    cursor: historyStep <= 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Undo"
                >
                  ↩ Undo
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#dc2626',
                    cursor: 'pointer',
                  }}
                  title="Clear Canvas"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                  title="Save drawing"
                >
                  💾 Save
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', cursor: 'crosshair' }}>
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your scratch calculations, formula notes, or process of elimination here..."
              style={{
                flex: 1,
                width: '100%',
                resize: 'none',
                padding: '12px',
                fontSize: '14px',
                lineHeight: 1.6,
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'monospace',
                backgroundColor: '#fdfdfd',
                color: '#1f2937',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
              <span>Saved locally for this session</span>
              <button
                type="button"
                onClick={() => setNotes('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Clear Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

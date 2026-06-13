'use client';
/**
 * src/components/barcode/BarcodeScanner.tsx
 * Escáner de código de barras usando la cámara del dispositivo.
 * Usa @zxing/browser para decodificar EAN/UPC.
 * Instalar: npm install @zxing/browser @zxing/library
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser';

export interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

type ScanState = 'idle' | 'scanning' | 'found' | 'error';

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const readerRef  = useRef<BrowserMultiFormatReader | null>(null);
  const [state, setState]     = useState<ScanState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [detected, setDetected] = useState('');
  const [torch, setTorch]     = useState(false);
  const streamRef  = useRef<MediaStream | null>(null);

  const stopScanning = useCallback(() => {
    readerRef.current?.reset();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const startScanning = useCallback(async () => {
    setState('scanning');
    setErrorMsg('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      readerRef.current = new BrowserMultiFormatReader();
      readerRef.current.decodeFromStream(stream, videoRef.current!, (result, err) => {
        if (result) {
          const code = result.getText();
          setDetected(code);
          setState('found');
          stopScanning();
          // Vibración háptica si disponible
          if ('vibrate' in navigator) navigator.vibrate(100);
          setTimeout(() => onDetected(code), 400);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.warn('[BarcodeScanner]', err);
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al acceder a la cámara';
      setErrorMsg(msg);
      setState('error');
    }
  }, [onDetected, stopScanning]);

  // Arrancar al montar
  useEffect(() => {
    startScanning();
    return () => stopScanning();
  }, [startScanning, stopScanning]);

  // Linterna (torch) — sólo en dispositivos compatibles
  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torch } as MediaTrackConstraintSet] });
      setTorch(t => !t);
    } catch {
      // silenciar — no todos los dispositivos lo soportan
    }
  };

  return (
    <div className="scanner-overlay">
      <div className="scanner-container">
        {/* Header */}
        <div className="scanner-header">
          <span className="scanner-title">Escanear código de barras</span>
          <button
            className="scanner-close"
            onClick={() => { stopScanning(); onClose(); }}
            aria-label="Cerrar escáner"
          >
            ✕
          </button>
        </div>

        {/* Visor de cámara */}
        <div className="scanner-viewport">
          <video
            ref={videoRef}
            className="scanner-video"
            muted
            playsInline
            autoPlay
          />
          {/* Guía de encuadre */}
          {state === 'scanning' && (
            <div className="scanner-frame" aria-hidden="true">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <div className="scan-line" />
            </div>
          )}
          {/* Overlay de éxito */}
          {state === 'found' && (
            <div className="scanner-success">
              <span className="scanner-success-icon">✓</span>
              <p>{detected}</p>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="scanner-controls">
          {state === 'scanning' && (
            <button
              className="btn-torch"
              onClick={toggleTorch}
              title="Linterna"
            >
              {torch ? '🔦 Apagar luz' : '🔦 Encender luz'}
            </button>
          )}
          {state === 'error' && (
            <div className="scanner-error">
              <p>{errorMsg || 'No se pudo acceder a la cámara.'}</p>
              <button className="btn-retry" onClick={startScanning}>Reintentar</button>
            </div>
          )}
          <p className="scanner-hint">
            {state === 'scanning' && 'Apunta el código de barras al encuadre'}
            {state === 'found'    && 'Código detectado — buscando producto…'}
          </p>
        </div>
      </div>

      <style jsx>{`
        .scanner-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,.92);
          display: flex; align-items: center; justify-content: center;
        }
        .scanner-container {
          width: 100%; max-width: 480px;
          display: flex; flex-direction: column;
          background: #111; border-radius: 16px; overflow: hidden;
        }
        .scanner-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 16px;
          background: #1a1a1a;
        }
        .scanner-title { color: #fff; font-size: 16px; font-weight: 600; }
        .scanner-close {
          background: none; border: none; color: #aaa; font-size: 20px;
          cursor: pointer; padding: 4px 8px; border-radius: 6px;
          transition: color .15s;
        }
        .scanner-close:hover { color: #fff; }

        .scanner-viewport {
          position: relative; width: 100%; aspect-ratio: 4/3;
          background: #000; overflow: hidden;
        }
        .scanner-video {
          width: 100%; height: 100%; object-fit: cover;
        }

        /* Marco de encuadre */
        .scanner-frame {
          position: absolute; inset: 10%; pointer-events: none;
        }
        .corner {
          position: absolute; width: 24px; height: 24px;
          border-color: #4ade80; border-style: solid; border-width: 0;
        }
        .corner.tl { top:0; left:0;  border-top-width: 3px; border-left-width:  3px; border-top-left-radius:  4px; }
        .corner.tr { top:0; right:0; border-top-width: 3px; border-right-width: 3px; border-top-right-radius: 4px; }
        .corner.bl { bottom:0; left:0;  border-bottom-width:3px; border-left-width:  3px; border-bottom-left-radius:  4px; }
        .corner.br { bottom:0; right:0; border-bottom-width:3px; border-right-width: 3px; border-bottom-right-radius: 4px; }

        /* Línea de escaneo animada */
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #4ade80, transparent);
          animation: scanMove 2s ease-in-out infinite;
        }
        @keyframes scanMove {
          0%   { top: 0; }
          50%  { top: calc(100% - 2px); }
          100% { top: 0; }
        }

        /* Overlay éxito */
        .scanner-success {
          position: absolute; inset: 0;
          background: rgba(0,0,0,.7);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; color: #4ade80;
          animation: fadeIn .2s ease;
        }
        .scanner-success-icon { font-size: 56px; }
        .scanner-success p    { font-size: 18px; font-weight: 600; }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

        /* Controles inferiores */
        .scanner-controls {
          padding: 16px; display: flex; flex-direction: column;
          align-items: center; gap: 10px; background: #1a1a1a;
        }
        .btn-torch {
          background: #2a2a2a; border: 1px solid #333; color: #ddd;
          border-radius: 8px; padding: 8px 20px; cursor: pointer; font-size: 14px;
          transition: background .15s;
        }
        .btn-torch:hover { background: #333; }
        .scanner-hint { color: #888; font-size: 13px; text-align: center; margin: 0; }
        .scanner-error { text-align: center; color: #f87171; }
        .btn-retry {
          margin-top: 8px; background: #4ade80; color: #000;
          border: none; border-radius: 8px; padding: 8px 20px;
          cursor: pointer; font-weight: 600; font-size: 14px;
        }
      `}</style>
    </div>
  );
}

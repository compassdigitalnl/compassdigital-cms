'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera } from 'lucide-react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startScanning()

    return () => {
      stopScanning()
    }
  }, [])

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('barcode-reader')
      scannerRef.current = scanner

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.777778, // 16:9
        formatsToSupport: [
          // @ts-ignore
          Html5Qrcode.SCAN_TYPE_CAMERA,
        ],
      }

      await scanner.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        config,
        (decodedText) => {
          // Success callback
          onScan(decodedText)
          stopScanning()
        },
        (errorMessage) => {
          // Error callback (usually "No QR code found")
          // We can ignore this as it's expected when no barcode is in view
        },
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Failed to start barcode scanner:', err)
      setError('Kon camera niet openen. Controleer je camera permissies.')
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear()
          setIsScanning(false)
        })
        .catch((err) => {
          console.error('Failed to stop scanner:', err)
        })
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.9)' }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'white',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{
            background: '#0A1628',
            color: 'white',
          }}
        >
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" style={{ color: '#00897B' }} />
            <h3
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                fontWeight: 800,
              }}
            >
              Scan Barcode
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner */}
        <div className="p-4">
          {error ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: '#FFF0F0', border: '1px solid #FF6B6B' }}
            >
              <p style={{ fontSize: '14px', color: '#FF6B6B', fontWeight: 600 }}>
                {error}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: '#FF6B6B',
                  color: 'white',
                  fontSize: '13px',
                }}
              >
                Sluiten
              </button>
            </div>
          ) : (
            <>
              <div
                id="barcode-reader"
                className="rounded-xl overflow-hidden"
                style={{
                  width: '100%',
                  minHeight: '300px',
                  background: '#F5F7FA',
                }}
              />
              <p
                className="mt-4 text-center"
                style={{
                  fontSize: '14px',
                  color: '#94A3B8',
                }}
              >
                Houd de barcode voor de camera
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

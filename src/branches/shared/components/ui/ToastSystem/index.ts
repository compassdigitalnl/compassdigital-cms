export {
  ToastSystemProvider,
  ToastSystemProvider as ToastProvider, // Alias for backward compatibility
  useToast,
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast
} from './Component'
export { Toast } from './Toast'
export type { Toast as ToastType, ToastConfig, ToastIconConfig } from './types'

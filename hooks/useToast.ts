import { toast } from "sonner";

export function useToast() {
  return {
    toastError: (message: string) => toast.error(message),
    toastSuccess: (message: string) => toast.success(message),
    toastInfo: (message: string) => toast.info(message),
    toast,
  };
}

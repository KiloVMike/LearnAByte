import { createContext, useState, useCallback, useContext } from "react";
import { ToastProvider, Toast, ToastViewport, ToastTitle, ToastDescription } from "@/components/ui/toast";

export const CustomToastContext = createContext();

export const useCustomToast = () => useContext(CustomToastContext);

export const CustomToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ title, description, variant = "default" }) => {
    setToast({ title, description, variant, open: true });
  }, []);

  const handleClose = () => {
    setToast(null);
  };

  return (
    <CustomToastContext.Provider value={{ showToast }}>
      <ToastProvider>
        {children}
        <Toast open={toast?.open} onOpenChange={handleClose} variant={toast?.variant}>
          <ToastTitle>{toast?.title}</ToastTitle>
          <ToastDescription>{toast?.description}</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </CustomToastContext.Provider>
  );
};
import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Hook to handle pressing Escape key to close modals
 * @param isOpen Boolean indicating if the modal is currently open
 * @param onClose Function to call when the Escape key is pressed
 * @param buttonRef Optional reference to a button that should receive focus when modal opens
 */
export function useModalEscape(
  isOpen: boolean,
  onClose: () => void,
  buttonRef?: RefObject<HTMLButtonElement>
) {
  useEffect(() => {
    if (!isOpen) return;
    
    // Function to handle Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Focus on button when modal opens
    if (buttonRef?.current) {
      buttonRef.current.focus();
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, buttonRef]);
}
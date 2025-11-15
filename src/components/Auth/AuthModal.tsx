import { useState } from "react";
import { X } from "lucide-react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onSuccess: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1e2337] rounded-2xl shadow-2xl border border-gray-800/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-[#151929] hover:bg-[#1a1f37] transition text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {mode === "signin" ? (
            <SignInForm
              onSwitchToSignUp={() => setMode("signup")}
              onSuccess={onSuccess}
            />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setMode("signin")} />
          )}
        </div>
      </div>
    </div>
  );
}

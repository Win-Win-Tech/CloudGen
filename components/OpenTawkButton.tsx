"use client";

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      toggle?: () => void;
    };
  }
}

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function OpenTawkButton({ className, children = "Live chat (Tawk.to)" }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof window !== "undefined" && window.Tawk_API?.maximize) {
          window.Tawk_API.maximize();
          return;
        }
        const launcher = document.querySelector(
          ".fixed.bottom-5.left-5 button",
        ) as HTMLButtonElement | null;
        launcher?.click();
      }}
    >
      {children}
    </button>
  );
}

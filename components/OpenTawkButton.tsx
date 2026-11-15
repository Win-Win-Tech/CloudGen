"use client";

import { openTawkChat } from "@/components/TawkTo";

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
        void openTawkChat();
      }}
    >
      {children}
    </button>
  );
}

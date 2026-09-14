import {
  SCHOOL_PHONE_DISPLAY,
  SCHOOL_PHONE_TEL,
} from "@/lib/site";
import { Phone } from "lucide-react";

interface PhoneLinkProps {
  className?: string;
  showIcon?: boolean;
}

export function PhoneLink({ className = "", showIcon = true }: PhoneLinkProps) {
  return (
    <a
      href={SCHOOL_PHONE_TEL}
      className={`inline-flex items-center gap-2 font-semibold text-primary hover:underline ${className}`}
    >
      {showIcon && <Phone className="h-4 w-4" />}
      {SCHOOL_PHONE_DISPLAY}
    </a>
  );
}

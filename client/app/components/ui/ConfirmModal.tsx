"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title = "Please Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-[#1F1F1F] bg-[#111] p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <AlertTriangle size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-mono uppercase tracking-widest text-primary">{title}</h3>
            <p className="mt-2 text-sm text-gray-300">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[#1F1F1F] px-4 py-2 text-xs font-mono font-bold uppercase text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded px-4 py-2 text-xs font-mono font-bold uppercase transition ${
              danger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-primary text-black hover:bg-primary/80"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

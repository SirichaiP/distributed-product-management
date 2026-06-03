"use client";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertModalProps {
  show: boolean;
  type?: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function AlertModal({
  show,
  type = "info",
  title,
  message,
  confirmText = "ตกลง",
  onConfirm,
}: AlertModalProps) {
  if (!show) return null;

  const config: Record<AlertType, { icon: string; color: string; button: string }> = {
    success: {
      icon: "✅",
      color: "text-success",
      button: "btn-success",
    },
    error: {
      icon: "❌",
      color: "text-danger",
      button: "btn-danger",
    },
    warning: {
      icon: "⚠️",
      color: "text-warning",
      button: "btn-warning",
    },
    info: {
      icon: "ℹ️",
      color: "text-primary",
      button: "btn-primary",
    },
  };

  const current = config[type];

  return (
    <div
      className="modal show d-block"
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        zIndex: 99999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-body text-center p-4">
            <div className={`display-4 mb-3 ${current.color}`}>
              {current.icon}
            </div>

            <h5 className="fw-bold mb-2">{title}</h5>

            <p className="text-muted mb-4">
              {message}
            </p>

            <button
              type="button"
              className={`btn ${current.button} px-4 rounded-pill`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
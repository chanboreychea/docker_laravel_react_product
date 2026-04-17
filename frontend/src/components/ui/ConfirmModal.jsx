import React from "react";
import { IconTrash } from "@tabler/icons-react";

export default function ConfirmModal({ 
  show, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  onConfirm, 
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  icon = <IconTrash size={48} className="text-danger mb-2" />
}) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal modal-blur fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", zIndex: 1055 }}
      >
        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onCancel}
            ></button>
            <div className="modal-status bg-danger"></div>
            <div className="modal-body text-center py-4">
              {icon}
              <h3>{title}</h3>
              <div className="text-secondary">{message}</div>
            </div>
            <div className="modal-footer">
              <div className="w-100">
                <div className="row">
                  <div className="col">
                    <button className="btn w-100" onClick={onCancel}>
                      {cancelText}
                    </button>
                  </div>
                  <div className="col">
                    <button className="btn btn-danger w-100" onClick={onConfirm}>
                      {confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
    </>
  );
}

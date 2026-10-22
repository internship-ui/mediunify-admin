import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-brand-slate-700 bg-white border border-brand-slate-200 rounded-xl hover:bg-brand-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-colors ${
              danger
                ? 'bg-brand-coral-600 hover:bg-brand-coral-700'
                : 'bg-brand-teal-600 hover:bg-brand-teal-700'
            }`}
          >
            {confirmText}                  
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl flex-shrink-0 ${
            danger ? 'bg-brand-coral-50 text-brand-coral-600 border border-brand-coral-100' : 'bg-brand-teal-50 text-brand-teal-600 border border-brand-teal-100'
          }`}
        >
          {danger ? <AlertTriangle className="w-6 h-6" /> : <Trash2 className="w-6 h-6" />}
        </div>         
        <div>
          <p className="text-sm text-brand-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

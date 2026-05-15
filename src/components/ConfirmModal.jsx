import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) => {
  if (!isOpen) return null;

  const accentColor = type === "danger" ? "var(--danger)" : "var(--primary)";

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card modal-content"
          style={{ maxWidth: '450px', textAlign: 'center' }}
        >
          <div className="modal-header" style={{ justifyContent: 'center' }}>
            <div style={{ 
              background: type === "danger" ? 'rgba(225, 29, 72, 0.1)' : 'rgba(79, 70, 229, 0.1)', 
              padding: '1rem', 
              borderRadius: '50%',
              marginBottom: '1rem'
            }}>
              <AlertTriangle size={40} color={accentColor} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>{title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>{message}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={onClose} 
              className="glass-card" 
              style={{ flex: 1, justifyContent: 'center', background: 'white' }}
            >
              {cancelText}
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }} 
              className={type}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;

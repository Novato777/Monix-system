import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, X } from 'lucide-react';

const StartModal = ({ isOpen, onClose, onConfirm }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosen = new Date(date);
    const now = new Date();
    now.setHours(0,0,0,0);

    if (chosen < now) {
      alert('No puedes elegir una fecha anterior a la actual.');
      return;
    }

    onConfirm(date);
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card modal-content"
          style={{ maxWidth: '450px' }}
        >
          <div className="modal-header">
            <h2 className="section-title" style={{ margin: 0 }}>
              <Calendar color="var(--success)" /> Iniciar Periodo
            </h2>
            <button onClick={onClose} className="close-btn"><X /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Selecciona la fecha en la que deseas iniciar tu control financiero. 
              Recuerda que no puedes elegir fechas pasadas.
            </p>

            <div className="input-group">
              <label className="stat-label">Fecha de Inicio</label>
              <input 
                type="date" 
                className="glass-input" 
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={onClose} className="glass-card" style={{ flex: 1, justifyContent: 'center' }}>
                Cancelar
              </button>
              <button type="submit" className="success btn-icon" style={{ flex: 1, justifyContent: 'center' }}>
                <CheckCircle2 size={20} /> Confirmar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StartModal;

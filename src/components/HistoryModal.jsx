import React from 'react';
import { X, FileText, Download, Calendar } from 'lucide-react';
import { generatePDF } from '../utils/PDFGenerator';

const HistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content animate-fade-in">
        <div className="modal-header">
          <h2 className="section-title" style={{ margin: 0 }}><Calendar /> Historial de Quincenas</h2>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} style={{ opacity: 0.2 }} />
              <p>No tienes reportes archivados todavía.</p>
            </div>
          ) : (
            history.map((report) => (
              <div key={report.id} className="history-item glass-card">
                <div className="history-info">
                  <span className="history-date">{report.startDate} - {report.endDate}</span>
                  <div className="history-stats">
                    <span>Ingreso: <strong>${report.income.toLocaleString('es-CO')}</strong></span>
                    <span>Saldo: <strong style={{ color: 'var(--primary)' }}>${report.balance.toLocaleString('es-CO')}</strong></span>
                  </div>
                </div>
                <button 
                  className="primary btn-icon" 
                  onClick={() => generatePDF(report)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <Download size={16} /> PDF
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

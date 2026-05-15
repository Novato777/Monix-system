import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

const SummaryCards = ({ income, expenses, balance, savings }) => {
  return (
    <div className="dashboard-grid">
      <div className="glass-card stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="stat-label btn-icon"><Wallet size={16} /> Ingresos Quincenales</div>
        <div className="stat-value income">${income.toLocaleString('es-CO')}</div>
      </div>
      
      <div className="glass-card stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="stat-label btn-icon"><TrendingDown size={16} /> Gastos Totales</div>
        <div className="stat-value expense">${expenses.toLocaleString('es-CO')}</div>
      </div>
      
      <div className="glass-card stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="stat-label btn-icon"><TrendingUp size={16} /> Saldo Disponible</div>
        <div className="stat-value balance">${balance.toLocaleString('es-CO')}</div>
      </div>
      
      <div className="glass-card stat-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="stat-label btn-icon"><Landmark size={16} /> Ahorro Automático</div>
        <div className="stat-value savings">${savings.toLocaleString('es-CO')}</div>
      </div>
    </div>
  );
};

export default SummaryCards;

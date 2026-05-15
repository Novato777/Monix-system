import React, { useState } from 'react';
import { PlusCircle, ReceiptText } from 'lucide-react';

const ExpenseForm = ({ onAddExpense, onUpdateIncome, currentIncome }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('variable');
  const [category, setCategory] = useState('Comida');

  const formatNumber = (val) => {
    if (!val) return '';
    return parseFloat(val).toLocaleString('es-CO');
  };

  const handleIncomeChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    onUpdateIncome(parseFloat(rawValue) || 0);
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(rawValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    
    onAddExpense({
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString('es-CO')
    });
    
    setName('');
    setAmount('');
  };

  return (
    <div className="glass-card form-section animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <h2 className="section-title"><ReceiptText /> Registrar Movimiento</h2>
      
      <div className="input-group">
        <label className="stat-label">Ingreso de la Quincena</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
          <input 
            type="text" 
            className="glass-input" 
            style={{ paddingLeft: '2rem' }}
            value={formatNumber(currentIncome)}
            onChange={handleIncomeChange}
            placeholder="0"
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)', margin: '1rem 0' }} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="input-group">
          <label className="stat-label">Nombre del Gasto</label>
          <input 
            type="text" 
            className="glass-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Almuerzo, Arriendo..."
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="stat-label">Monto</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
              <input 
                type="text" 
                className="glass-input" 
                style={{ paddingLeft: '2rem' }}
                value={formatNumber(amount)}
                onChange={handleAmountChange}
                placeholder="0"
              />
            </div>
          </div>
          <div className="input-group">
            <label className="stat-label">Tipo</label>
            <select 
              className="glass-input" 
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="variable">Variable</option>
              <option value="fixed">Fijo (Obligatorio)</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="stat-label">Categoría</label>
          <select 
            className="glass-input" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Comida">Comida</option>
            <option value="Transporte">Transporte</option>
            <option value="Servicios">Servicios</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <button type="submit" className="primary btn-icon" style={{ justifyContent: 'center' }}>
          <PlusCircle size={20} /> Añadir Gasto
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;

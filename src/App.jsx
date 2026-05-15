import React, { useState, useEffect } from 'react';
import './App.css';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import FinancialChart from './components/FinancialChart';
import HistoryModal from './components/HistoryModal';
import StartModal from './components/StartModal';
import ConfirmModal from './components/ConfirmModal';
import { generatePDF } from './utils/PDFGenerator';
import { Download, Trash2, PieChart, History, AlertCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo2.png';
import logoFooter from './assets/logo3.png';

function App() {
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('finances_income');
    return saved ? parseFloat(saved) : 0;
  });
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finances_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('finances_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem('finances_start_date');
    return saved ? saved : new Date().toLocaleDateString('es-CO');
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [savingsRate] = useState(0.20);

  const handleConfirmStart = (date) => {
    const chosen = new Date(date);
    setTransactions([]);
    setIncome(0);
    setStartDate(chosen.toLocaleDateString('es-CO'));
    setShowStartModal(false);
    setShowPrompt(false);
    alert(`Periodo iniciado el ${chosen.toLocaleDateString('es-CO')}. El reporte se reiniciará en 15 días.`);
  };

  useEffect(() => {
    localStorage.setItem('finances_income', income);
    localStorage.setItem('finances_transactions', JSON.stringify(transactions));
    localStorage.setItem('finances_history', JSON.stringify(history));
    localStorage.setItem('finances_start_date', startDate);
    
    // Check if 15 days have passed
    const checkPeriod = () => {
      if (!startDate) return;
      const start = new Date(startDate.split('/').reverse().join('-'));
      const today = new Date();
      const diffTime = Math.abs(today - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 15 && transactions.length > 0) {
        setShowPrompt(true);
      }
    };
    checkPeriod();
  }, [income, transactions, history, startDate]);

  const totalExpenses = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - totalExpenses;
  const savings = balance > 0 ? balance * savingsRate : 0;

  const handleAddExpense = (expense) => {
    setTransactions([expense, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleArchive = () => {
    const newReport = {
      id: Date.now(),
      startDate: startDate,
      endDate: new Date().toLocaleDateString('es-CO'),
      income,
      transactions,
      totalExpenses,
      balance,
      savings
    };

    setHistory([newReport, ...history]);
    setTransactions([]);
    setIncome(0);
    const today = new Date().toLocaleDateString('es-CO');
    setStartDate(today);
    setShowPrompt(false);
    alert('¡Quincena archivada con éxito! Puedes verla en tu historial.');
  };

  const handleDownloadPDF = () => {
    // Función para convertir imagen a base64
    const getBase64Image = (imgUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
      });
    };

    getBase64Image(logo).then((base64Logo) => {
      generatePDF({
        income,
        expenses: totalExpenses,
        balance,
        savings,
        transactions,
        logo: base64Logo,
        startDate
      });
    });
  };

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    setTransactions([]);
    setIncome(0);
    setStartDate(new Date().toLocaleDateString('es-CO'));
  };

  return (
    <div className="app-container">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="logo-container"
          >
            <img src={logo} alt="Monix Logo" />
          </motion.div>
          <div>
            <h1 className="title">Monix</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.1rem' }}>
              Iniciado: {startDate}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.button 
            whileHover={{ y: -3 }} 
            whileTap={{ scale: 0.95 }} 
            className="success btn-icon" 
            onClick={() => setShowStartModal(true)}
            style={{ boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)' }}
          >
            <TrendingUp size={20} /> Inicio
          </motion.button>
          <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} className="glass-card btn-icon" onClick={() => setShowHistory(true)} style={{ background: 'white' }}>
            <History size={20} /> Historial
          </motion.button>
          <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} className="primary btn-icon" onClick={handleDownloadPDF}>
            <Download size={20} /> Reporte PDF
          </motion.button>
          <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} className="danger btn-icon" onClick={handleClearAll} title="Borrar todo">
            <Trash2 size={20} />
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {showStartModal && (
          <StartModal 
            isOpen={showStartModal} 
            onClose={() => setShowStartModal(false)} 
            onConfirm={handleConfirmStart} 
          />
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClear}
        title="¿Borrar todo?"
        message="Esta acción eliminará todos los registros actuales y restablecerá la fecha de inicio a hoy. ¿Estás seguro?"
        confirmText="Borrar Todo"
        type="danger"
      />

      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            className="archive-prompt"
          >
            <div className="prompt-text btn-icon">
              <AlertCircle size={40} />
              <div>
                <h3 style={{ fontSize: '1.5rem' }}>¿Finalizar quincena?</h3>
                <p>Han pasado 15 días desde tu último reporte. ¿Quieres archivarlo y empezar uno nuevo?</p>
              </div>
            </div>
            <div className="prompt-actions">
              <button className="btn-white" onClick={handleArchive}>Sí, Archivar</button>
              <button className="btn-outline-white" onClick={() => setShowPrompt(false)}>Después</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SummaryCards 
        income={income} 
        expenses={totalExpenses} 
        balance={balance} 
        savings={savings} 
      />

      <main className="main-content">
        <ExpenseForm 
          onAddExpense={handleAddExpense} 
          onUpdateIncome={setIncome} 
          currentIncome={income}
        />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card list-section"
        >
          <h2 className="section-title"><PieChart size={28} color="var(--primary)" /> Distribución y Detalle</h2>
          
          <FinancialChart expenses={transactions} />

          <div className="transaction-list">
            <h3 className="stat-label" style={{ marginBottom: '1rem' }}>Últimos Movimientos</h3>
            <div className="transactions-scroll">
              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                  <p style={{ fontSize: '1.1rem' }}>No hay gastos registrados aún.</p>
                </div>
              ) : (
                transactions.map((t, idx) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="transaction-item"
                  >
                    <div className="item-info">
                      <span className="item-name">{t.name}</span>
                      <span className="item-category">{t.category} • {t.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span className={`item-amount ${t.type}`}>
                        ${t.amount.toLocaleString('es-CO')}
                      </span>
                      <motion.button 
                        whileHover={{ scale: 1.2, color: 'var(--danger)' }}
                        onClick={() => handleDeleteTransaction(t.id)}
                        style={{ background: 'none', color: '#cbd5e1', padding: '0.25rem' }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <HistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history} 
      />

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="app-footer"
      >
        <div className="footer-content">
          <div className="footer-brand" style={{ flexDirection: 'row', alignItems: 'center', gap: '2rem' }}>
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="logo-container-footer"
            >
              <img src={logoFooter} alt="Monix Footer Logo" />
            </motion.div>
            <div>
              <span className="footer-logo">Monix</span>
              <p style={{ fontWeight: '500' }}>Gestión financiera quincenal simplificada.</p>
            </div>
          </div>
          <div className="footer-info">
            <p>© {new Date().getFullYear()} Monix - Ultra Premium Edition</p>
            <p>v2.0.0 • Hecho con ❤️ y React</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;

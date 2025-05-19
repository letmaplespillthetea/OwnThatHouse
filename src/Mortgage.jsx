import React, { useState } from 'react';
import './form.css';
import { useLocation, useNavigate } from 'react-router-dom';
import PlanTabs from "./PlanTabs";
import { usePlans } from "./PlanContext";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadMortgagePlan from './components/DownloadMortgagePlan';


export default function Mortgage() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [mortgageTerm, setTerm] = useState('20');
  const [customTerm, setCustomTerm] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [selectedYear, setSelectedYear] = useState(1);
  const yearMax = Math.ceil(mortgageTerm); 
  const [timeFrame, setTimeFrame] = useState("Monthly");
  const navigate = useNavigate();

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };


  const location = useLocation();
  const prevForm = location.state?.formData || {};
  const yearlyArray = location.state?.yearlyArray || {};
  const presentPrice = location.state?.presentPrice || 0;
  const futurePrice = location.state?.futurePrice || null;

  const loanBasePrice = futurePrice ?? presentPrice;
  const currencyList = ['VND', 'USD', 'EUR'];
  const currencySymbols = {
    VND: '₫',
    USD: '$',
    EUR: '€',
  };

  const toggleCurrency = () => {
    const idx = currencyList.indexOf(currency);
    const next = (idx + 1) % currencyList.length;
    setCurrency(currencyList[next]);
  };

  
  const loan = loanBasePrice * 0.7;
  const numPayments = mortgageTerm * 12;
  const principalPayment = loan / numPayments;

  // Fixed interest for first 3 years
  let maxTotalMonthlyPayment = 0;

  let scheduleMonth = [];
  let remaining = loan;

  for (let i = 0; i < numPayments; i++) {
    const currentYear = Math.floor(i / 12) + 1;

    const depositRate = 0.048;
    const monthlyInterestRate =
      currentYear <= 3
        ? 0.055 / 12
        : (depositRate + 0.03) / 12;

    const interestPayment = remaining * monthlyInterestRate;
    const totalPayment = principalPayment + interestPayment;

    maxTotalMonthlyPayment = Math.max(maxTotalMonthlyPayment, totalPayment);

    scheduleMonth.push({
      month: (i % 12) + 1,
      year: currentYear,
      principal: principalPayment,
      interest: interestPayment,
      total: totalPayment,
      remaining: remaining - principalPayment,
    });

    remaining -= principalPayment;
  }

  remaining = loan;

    // Filter theo năm
  let scheduleMonthFull = scheduleMonth;
  scheduleMonth = scheduleMonth.filter(item => item.year === selectedYear);

  let scheduleYearly = [];
  let currentYear = 1;
  let monthInYear = 0;

  let yearlyEntry = {
    year: currentYear,
    principal: 0,
    interest: 0,
    total: 0,
    remaining: 0,
  };

  for (let i = 0; i < numPayments; i++) {
    const depositRate = 0.048;
    const monthlyInterestRate =
      currentYear <= 3
        ? 0.055 / 12
        : (depositRate + 0.03) / 12;

    const interestPayment = remaining * monthlyInterestRate;
    const totalPayment = principalPayment + interestPayment;

    maxTotalMonthlyPayment = Math.max(maxTotalMonthlyPayment, totalPayment);

    yearlyEntry.principal += principalPayment;
    yearlyEntry.interest += interestPayment;
    yearlyEntry.total += totalPayment;
    yearlyEntry.remaining = remaining - principalPayment;

    remaining -= principalPayment;
    monthInYear++;

    if (monthInYear === 12 || i === numPayments - 1) {
      scheduleYearly.push({ ...yearlyEntry });

      // Reset cho năm tiếp theo
      currentYear++;
      monthInYear = 0;
      yearlyEntry = {
        year: currentYear,
        principal: 0,
        interest: 0,
        total: 0,
        remaining: remaining,
      };
    }
  }

    let scheduleYearFull = scheduleYearly;
    scheduleYearly = scheduleYearly.filter(item => item.year === selectedYear);

    let schedule = [];
  
    if (timeFrame == "Monthly") {
      schedule = scheduleMonth;
    }
    else {
      schedule = scheduleYearly;
    }


  // Minimum income required
  const minRequiredIncome = maxTotalMonthlyPayment + parseFloat(expenses);
  const qualified = income >= minRequiredIncome;

  console.log(qualified);

  return (
    <div className="container">
              <PlanTabs />
      <div className="cards">
        {/* LEFT INPUT */}
        <div className="card input-card">
          <h2 className="card-title">
            SECOND PHASE: <span className="highlight">MORTGAGE</span>
          </h2>
          <p className="card-subtitle">
            Great! You have enough to make the down payment. Now let’s see if you qualify for the loan and will be able to pay it back!
          </p>

          {/* CURRENT INCOME & EXPENSES */}
          <div className="form-row-double">
            <div className="form-col">
              <label>CURRENT INCOME</label>
              <div className="input-group">
                <div className="currency-toggle" onClick={toggleCurrency}>
                  {currencySymbols[currency]}
                </div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
                 <select
                className="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="VND">₫</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
              </select>
              </div>
            </div>

            <div className="form-col">
              <label>CURRENT EXPENSES</label>
              <div className="input-group">
                <div className="currency-toggle" onClick={toggleCurrency}>
                  {currencySymbols[currency]}
                </div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                />
                 <select
                className="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="VND">₫</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
              </select>
              </div>
            </div>
          </div>

          <p className="form-tip">TIPS: Click the drop down button to change currency!</p>

          {/* MORTGAGE TERM */}
          <div className="form-row">
            <label>MORTGAGE TERM</label>
            <div className="input-group">
              <select
                value={mortgageTerm}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
                <option value="40">40 Years</option>
                <option value="custom">Custom</option>
              </select>
              {mortgageTerm === 'custom' && (
                <input
                  type="number"
                  placeholder="Years"
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  style={{ width: '80px', marginLeft: '8px' }}
                />
              )}
            </div>
          </div>

          <div className="check-btn-wrapper">
            <button className="check-btn">CHECK</button>
          </div>
        </div>

        {/* RIGHT RESULT */}
        <div className="card result-card">
          <h2 className="card-title">
            <span className="highlight">RESULT</span>
          </h2>

          <p>
            Minimum Income for the Loan:{" "}
            <strong>{minRequiredIncome.toLocaleString()} VND</strong>
          </p>
          <p>
            Your Declared Monthly Income:{" "}
            <strong>{parseFloat(income).toLocaleString()} VND</strong>
          </p>

          {/* Time Frame and Download */}
          <div className="flex-row">
            <div className="flex-row space-between align-center">
              <div>
                <label style={{ color: '#2778E1', fontWeight: 'bold' }}>Time Frame</label>
                <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>

              </div>
              <DownloadMortgagePlan
                scheduleMonthFull={scheduleMonthFull}
                scheduleYearFull={scheduleYearFull}
              />
              <select className="calendar-btn" value={selectedYear} onChange={handleYearChange}>
                {Array.from({ length: yearMax }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    YEAR {i + 1}
                  </option>
                ))}
              </select>

          </div>
        </div>

          {/* Table */}
          <div className="payment-container">
          <table className="payment-schedule">
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Remaining Balance</th>
                <th>Principal Payment</th>
                <th>Interest Payment</th>
                <th>Total Payment</th>
              </tr>
            </thead>
            <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{timeFrame === "Monthly" ? item.month : "-"}</td>
                <td>{item.remaining.toFixed(2).toLocaleString()}</td>
                <td>{item.principal.toFixed(2).toLocaleString()}</td>
                <td>{item.interest.toFixed(2).toLocaleString()}</td>
                <td>{item.total.toFixed(2).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>

          <p style={{ marginTop: '12px' }}>
            Principal payment from month 1 to end:{" "}
            <strong>
              {principalPayment.toLocaleString()} VND
            </strong>
          </p>

          <button
            className="next-btn"
            onClick={() => navigate("/final-plan", {
              state: {
                formData: {
                  ...prevForm,
                  income,
                  expenses,
                  mortgageTerm,
                  customTerm,
                },
                status: qualified, scheduleMonthFull, scheduleYearFull, yearlyArray
              }
            })
          }
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

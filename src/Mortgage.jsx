// src/Mortgage.jsx
import React, { useState } from "react";
import "./form.css";
import { useLocation, useNavigate } from "react-router-dom";
import PlanTabs from "./PlanTabs";
import { stripNonDigits, formatWithCommas, parseNumber } from "./utils/numberFormatting";
import DownloadMortgagePlan from "./components/DownloadMortgagePlan";
import LoanInfoCard from "./components/LoanInfoCard";

export default function Mortgage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevForm = location.state?.formData || {};
  const yearlyArray = location.state?.yearlyArray || [];
  const presentPrice = location.state?.presentPrice || 0;
  const futurePrice = location.state?.futurePrice || 0;

  const [incomeInput, setIncomeInput] = useState("");
  const [expensesInput, setExpensesInput] = useState("");
  const [mortgageTerm, setMortgageTerm] = useState("20");
  const [customTerm, setCustomTerm] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [selectedYear, setSelectedYear] = useState(1);
  const [timeFrame, setTimeFrame] = useState("Monthly");

  const handleIncomeChange = (e) => {
    const raw = stripNonDigits(e.target.value);
    const formatted = formatWithCommas(raw);
    setIncomeInput(formatted);
  };

  const handleExpensesChange = (e) => {
    const raw = stripNonDigits(e.target.value);
    const formatted = formatWithCommas(raw);
    setExpensesInput(formatted);
  };

  const loanBasePrice = futurePrice || presentPrice;
  const loanAmount = loanBasePrice * 0.7;
  const termYears = mortgageTerm === "custom" ? parseInt(customTerm, 10) || 0 : parseInt(mortgageTerm, 10);
  const totalPayments = termYears * 12;

  let maxMonthlyPayment = 0;
  let remaining = loanAmount;
  const principalPayment = totalPayments > 0 ? loanAmount / totalPayments : 0;

  const scheduleMonthFull = [];
  for (let i = 0; i < totalPayments; i++) {
    const currentYear = Math.floor(i / 12) + 1;
    const depositRate = 0.048;
    const monthlyInterestRate = currentYear <= 3 ? 0.055 / 12 : (depositRate + 0.03) / 12;

    const interestPayment = remaining * monthlyInterestRate;
    const totalPayment = principalPayment + interestPayment;
    maxMonthlyPayment = Math.max(maxMonthlyPayment, totalPayment);

    scheduleMonthFull.push({
      month: (i % 12) + 1,
      year: currentYear,
      principal: principalPayment,
      interest: interestPayment,
      total: totalPayment,
      remaining: remaining - principalPayment
    });

    remaining -= principalPayment;
  }

  const scheduleYearFull = [];
  remaining = loanAmount;
  let idx = 0;
  let yearCount = 1;
  while (idx < scheduleMonthFull.length) {
    let sumPrincipal = 0;
    let sumInterest = 0;
    let sumTotal = 0;
    let lastRemaining = 0;

    for (let m = 0; m < 12 && idx < scheduleMonthFull.length; m++, idx++) {
      const row = scheduleMonthFull[idx];
      sumPrincipal += row.principal;
      sumInterest += row.interest;
      sumTotal += row.total;
      lastRemaining = row.remaining;
      remaining -= row.principal;
    }

    scheduleYearFull.push({
      year: yearCount,
      principal: sumPrincipal,
      interest: sumInterest,
      total: sumTotal,
      remaining: lastRemaining
    });
    yearCount++;
  }

  const amortizationRows =
    timeFrame === "Monthly"
      ? scheduleMonthFull.filter((r) => r.year === selectedYear)
      : scheduleYearFull.filter((y) => y.year === selectedYear);

  const incomeNum = parseNumber(incomeInput);
  const expensesNum = parseNumber(expensesInput);
  const minRequiredIncome = maxMonthlyPayment + expensesNum;
  const qualified = incomeNum >= minRequiredIncome;

  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value, 10));
  const handleTimeFrameChange = (e) => setTimeFrame(e.target.value);

  return (
    <div className="container">
      <PlanTabs />
      <div className="cards">
        {/* INPUT CARD */}
        <div className="card input-card">
          <h2 className="card-title">
            SECOND PHASE: <span className="highlight">MORTGAGE</span>
          </h2>
          <p className="card-subtitle">
            Great! You have enough to make the down payment. Now let’s
            see if you qualify for the loan and will be able to pay it back!
          </p>

          <div className="form-row-double">
            {/* INCOME */}
            <div className="form-col">
              <label>CURRENT INCOME</label>
              <div className="input-group">
                <div className="currency-toggle" onClick={() => {
                  const list = ["VND", "USD", "EUR"];
                  const next = (list.indexOf(currency) + 1) % list.length;
                  setCurrency(list[next]);
                }}>
                  {currency === "VND" ? "₫" : currency === "USD" ? "$" : "€"}
                </div>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={incomeInput}
                  onChange={handleIncomeChange}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="VND">₫</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>

            {/* EXPENSES */}
            <div className="form-col">
              <label>CURRENT EXPENSES</label>
              <div className="input-group">
                <div className="currency-toggle" onClick={() => {
                  const list = ["VND", "USD", "EUR"];
                  const next = (list.indexOf(currency) + 1) % list.length;
                  setCurrency(list[next]);
                }}>
                  {currency === "VND" ? "₫" : currency === "USD" ? "$" : "€"}
                </div>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={expensesInput}
                  onChange={handleExpensesChange}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="VND">₫</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>
          </div>

          <p className="form-tip">TIPS: Click the drop down button to change currency!</p>

          <div className="form-row">
            <label>MORTGAGE TERM</label>
            <div className="input-group">
              <select value={mortgageTerm} onChange={(e) => setMortgageTerm(e.target.value)}>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
                <option value="40">40 Years</option>
                <option value="custom">Custom</option>
              </select>
              {mortgageTerm === "custom" && (
                <input
                  type="number"
                  placeholder="Years"
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  style={{ width: "80px", marginLeft: "8px" }}
                />
              )}
            </div>
          </div>

          <div className="check-btn-wrapper">
            <button className="check-btn">CHECK</button>
          </div>
        </div>

        {/* RESULT CARD */}
        <div className="card result-card">
          <h2 className="card-title">
            <span className="highlight">RESULT</span>
          </h2>

          {!incomeInput ? (
            <p className="card-subtitle" style={{ color: "#f97316", fontWeight: "500" }}>
              You have not enter any information!
              <LoanInfoCard />
            </p>
          ) : (
            <>
              <p>
                Minimum Income for the Loan:{" "}
                <strong>
                  {minRequiredIncome.toLocaleString("en-US")} {currency}
                </strong>
              </p>
              <p>
                Your Declared Monthly Income:{" "}
                <strong>
                  {parseNumber(incomeInput).toLocaleString("en-US")} {currency}
                </strong>
              </p>

              <div className="flex-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ color: "#2778E1", fontWeight: "bold" }}>Time Frame</label>
                  <select value={timeFrame} onChange={handleTimeFrameChange}>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <DownloadMortgagePlan
                  scheduleMonthFull={scheduleMonthFull}
                  scheduleYearFull={scheduleYearFull}
                />

                <select
                  className="calendar-btn"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: termYears }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      YEAR {i + 1}
                    </option>
                  ))}
                </select>
              </div>

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
                    {amortizationRows.map((item, index) => (
                      <tr key={index}>
                        <td>{item.year}</td>
                        <td>{timeFrame === "Monthly" ? item.month : "-"}</td>
                        <td>{item.remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{item.principal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{item.interest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{item.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ marginTop: "12px" }}>
                Principal payment from month 1 to end:{" "}
                <strong>
                  {principalPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </strong>
              </p>

              <button
                className="next-btn"
                onClick={() =>
                  navigate("/final-plan", {
                    state: {
                      formData: {
                        ...prevForm,
                        income: parseNumber(incomeInput),
                        expenses: parseNumber(expensesInput),
                        mortgageTerm,
                        customTerm
                      },
                      status: incomeNum >= minRequiredIncome,
                      scheduleMonthFull,
                      scheduleYearFull,
                      yearlyArray
                    }
                  })
                }
              >
                NEXT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

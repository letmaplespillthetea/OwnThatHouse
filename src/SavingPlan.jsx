import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import "./form.css";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const SavingPlan = () => {
  const location = useLocation();

  const initHousePrice = location.state?.housePrice || "";
  const initSavings = location.state?.savings || "";

  const [housePrice, setHousePrice] = useState(initHousePrice);
  const [savings, setSavings] = useState(initSavings);
  const [growthRate, setGrowthRate] = useState("");
  const [downPaymentPct, setDownPaymentPct] = useState("30");
  const [customPct, setCustomPct] = useState("");
  const [yearsToSave, setYearsToSave] = useState("1");
  const [futurePrice, setFuturePrice] = useState("");
  const navigate = useNavigate();
  
  const [monthlySavings, setMonthlySavings] = useState(null);
  const [months, setMonths] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleCheckSavingsPlan = () => {
    const years = parseInt(yearsToSave);
    const months = years * 12;

    const growth = parseFloat(growthRate) / 100 || 0;
    const dpPct = downPaymentPct === "custom" ? parseFloat(customPct) / 100 : parseFloat(downPaymentPct) / 100;
    const presentPrice = parseFloat(housePrice) || 0;
    const savingsNow = parseFloat(savings) || 0;

    const futurePrice = presentPrice * Math.pow(1 + growth, years);
    const futureAmt = futurePrice * dpPct + futurePrice * 0.015;

    const noDepositRate = years === 1 ? 0.047 : 0.049;
    const adjustedSavings = savingsNow * Math.pow(1 + noDepositRate, years);
    const additionalRequired = futureAmt - adjustedSavings;

    const depositRate = years === 1 ? 0.04 : 0.042;
    const r = depositRate / 12;

    const monthly = additionalRequired > 0
      ? (additionalRequired * r) / (Math.pow(1 + r, months) - 1)
      : 0;

    setMonthlySavings(monthly.toFixed(0));
    setMonths(months);
    setShowResult(true);
    setFuturePrice(futurePrice);
  };

  return (
    <div className="container">
      <div className="cards">

        {/* LEFT SIDE */}
        <div className="card input-card">
          <h2 className="card-title">
            FIRST PHASE: <span className="highlight">DOWNPAYMENT</span>
          </h2>
          <p className="card-subtitle">
            Let’s begin by learning about your dream home and what you currently have saved!
          </p>

          {/* Form rows */}
          <div className="form-row-double">
            <div className="form-col">
              <label>HOUSE PRICE</label>
              <div className="input-group">
                <input type="number" value={housePrice} onChange={(e) => setHousePrice(e.target.value)} />
                <span className="currency-symbol">₫</span>
              </div>
            </div>
            <div className="form-col">
              <label>SAVINGS</label>
              <div className="input-group">
                <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} />
                <span className="currency-symbol">₫</span>
              </div>
            </div>
          </div>

          <div className="form-row-double">
            <div className="form-col">
              <label>YEARS WILLING TO SAVE</label>
              <div className="input-group">
                <input
                  type="number"
                  value={yearsToSave}
                  onChange={(e) => setYearsToSave(e.target.value)}
                />
              </div>
            </div>

            <div className="form-col">
              <label>
                HOUSE PRICE GROWTH
                <span className="tooltip-icon">ⓘ</span>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="% per year"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <label>DOWNPAYMENT GOAL</label>
            <div className="input-group">
              <select value={downPaymentPct} onChange={(e) => setDownPaymentPct(e.target.value)}>
                <option value="30">30% - Default</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
                <option value="custom">Custom</option>
              </select>
              {downPaymentPct === "custom" && (
                <input
                  type="number"
                  placeholder="%"
                  value={customPct}
                  onChange={(e) => setCustomPct(e.target.value)}
                  style={{ marginLeft: "8px", width: "60px" }}
                />
              )}
            </div>
          </div>

          <div className="check-btn-wrapper">
            <button className="check-btn" onClick={handleCheckSavingsPlan}>
              CHECK SAVINGS PLAN
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="card result-card">
          <h2 className="card-title">
            <span className="highlight">RESULT</span>
          </h2>

          {showResult ? (
            <div className="result-success">
              <p className="summary-line">
                You need to save <strong>{monthlySavings} ₫</strong> per month for <strong>{months}</strong> months to reach your goal.
              </p>

              <Bar
                data={{
                  labels: Array.from({ length: 5 }, (_, i) => `${i + 1}`),
                  datasets: [{
                    label: "Amount (₫)",
                    data: Array(5).fill(monthlySavings),
                    backgroundColor: "#00cfff"
                  }]
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />

              <p className="followup-line">
                Are you ready for the <strong>next part</strong> of your saving plan? You can always come back to change variables!
              </p>
              <button
                  className="next-btn"
                  onClick={() =>
                    navigate('/mortgage', {
                      state: { futurePrice: parseFloat(housePrice) }
                    })
                  }
                >
                  NEXT
                </button>
            </div>
          ) : (
            <p className="card-subtitle">Click CHECK SAVINGS PLAN to see your result.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingPlan;

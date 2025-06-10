// src/SavingPlan.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import BankCard from "./components/BankCard.jsx";
import MutualFundCard from "./components/MutualFundCard";
import MutualFundQuestionnaire from "./components/MutualFundQuestionnaire.jsx";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "./form.css";
import PlanTabs from "./PlanTabs";
import { stripNonDigits, formatWithCommas, parseNumber } from "./utils/numberFormatting";
import {
  FaMapMarkerAlt,
  FaHome,
  FaChartLine,
  FaInfoCircle,
  FaHandHoldingUsd
} from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SavingPlan() {
  const location = useLocation();
  const navigate = useNavigate();

  // ────────────────────────────────────────────────────────────────────────────
  // Read previous form data (DownPayment tab) from location.state
  const prevFormData = location.state?.formData || {};
  const initialCurrency = prevFormData.currency || "VND";

  // Currency state + symbol map
  const [currency, setCurrency] = useState(initialCurrency);
  const currencySymbols = {
    VND: "₫",
    USD: "$",
    EUR: "€"
  };

    const growthRateMap = {
    "Hanoi": {
      "Apartment": "10",
      "Ground-houses": "5",
    },
    "Danang": {
      "Apartment": "7",
      "Ground-houses": "6",
    },
    "HoChiMinh": {
      "Apartment": "11",
      "Ground-houses": "5",
    },
  };
  

  // ────────────────────────────────────────────────────────────────────────────
  // Initialize inputs (show commas if a number was passed from DownPayment)
  const initHousePriceNum = prevFormData.housePrice || 0;
  const initSavingsNum = prevFormData.savings || 0;

  const [housePriceInput, setHousePriceInput] = useState(
    initHousePriceNum > 0 ? initHousePriceNum.toLocaleString("en-US") : ""
  );
  const [savingsInput, setSavingsInput] = useState(
    initSavingsNum > 0 ? initSavingsNum.toLocaleString("en-US") : ""
  );

  const [recommendedFunds, setRecommendedFunds] = useState([]);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});

  // Other form fields
  const [growthRate, setGrowthRate] = useState(prevFormData.growthRate || "");
  const [city, setCity] = useState(prevFormData.city || "");
  const [houseType, setHouseType] = useState(prevFormData.houseType || "");

  const [yearsToSave, setYearsToSave] = useState(prevFormData.yearsToSave || "1");
  const [downPaymentPct, setDownPaymentPct] = useState(prevFormData.downPaymentPct || "30");
  const [customPct, setCustomPct] = useState(prevFormData.customPct || "");
  const [savingOption, setSavingOption] = useState("bank");

  // Computed results
  const [monthlySavings, setMonthlySavings] = useState(null);
  const [yearlyArray, setYearlyArray] = useState([]);
  const [futurePrice, setFuturePrice] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
      const growth =
        growthRateMap[city]?.[houseType] ?? "8"; // fallback default
      setGrowthRate(growth);
    }, [city, houseType]);

  // ────────────────────────────────────────────────────────────────────────────
  // Live-format housePriceInput on each keystroke
  const handleHousePriceChange = (e) => {
    const raw = stripNonDigits(e.target.value);
    const formatted = formatWithCommas(raw);
    setHousePriceInput(formatted);
  };

  // Live-format savingsInput on each keystroke
  const handleSavingsChange = (e) => {
    const raw = stripNonDigits(e.target.value);
    const formatted = formatWithCommas(raw);
    setSavingsInput(formatted);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Generate yearly savings array
  const generateYearlySavings = ({ currentSavings, monthlySaving, years, noDepositRate, depositRate }) => {
    const arr = [];
    for (let n = 1; n <= years; n++) {
      const r = depositRate / 12;
      const annuityFactor = (Math.pow(1 + r, n * 12) - 1) / r;
      const yearTotal = currentSavings * Math.pow(1 + noDepositRate, n) + monthlySaving * annuityFactor;
      arr.push({ year: n, value: Math.round(yearTotal) });
    }
    return arr;
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Handle “CHECK SAVINGS PLAN” click
  const handleCheckSavingsPlan = () => {
    // 1) Parse numeric inputs (strip commas → Number)
    const priceNum = parseNumber(housePriceInput);
    const savingsNum = parseNumber(savingsInput);
    const yrs = parseInt(yearsToSave, 10) || 0;
    const growth = parseFloat(growthRate) / 100 || 0;

    // 2) Determine down payment percentage
    const dpPct =
      downPaymentPct === "custom"
        ? (parseFloat(customPct) || 0) / 100
        : parseFloat(downPaymentPct) / 100;

    // 3) Future home price = priceNum * (1 + growth)^years
    const projPrice = priceNum * Math.pow(1 + growth, yrs);
    setFuturePrice(projPrice);

    // 4) Future down payment needed (includes 1.5% buffer)
    const futureDownPayment = projPrice * (dpPct + 0.015);

    // 5) Grow current savings at “no deposit” rate
    const noDepositRate = yrs === 1 ? 0.047 : 0.049;
    const adjustedSavings = savingsNum * Math.pow(1 + noDepositRate, yrs);

    // 6) Compute “remaining gap” = futureDownPayment − adjustedSavings
    const remainingGap = Math.max(0, futureDownPayment - adjustedSavings);

    // 7) Monthly savings required (annuity formula)
    const depositRate = yrs === 1 ? 0.04 : 0.042;
    const r = depositRate / 12;
    const totalMonths = yrs * 12;
    const perMonth =
      totalMonths > 0
        ? (remainingGap * r) / (Math.pow(1 + r, totalMonths) - 1)
        : 0;
    const perMonthRounded = Math.round(perMonth);
    setMonthlySavings(perMonthRounded);

    // 8) Generate yearly breakdown
    const arr = generateYearlySavings({
      currentSavings: savingsNum,
      monthlySaving: perMonthRounded,
      years: yrs,
      noDepositRate,
      depositRate
    });
    setYearlyArray(arr);


    console.log(recommendedFunds);
    // 9) Show the result
    setShowResult(true);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // “NEXT” button: navigate to Mortgage, passing all necessary data
  const handleNext = () => {
  const priceNum = parseNumber(housePriceInput);
  const savingsNum = parseNumber(savingsInput);


    navigate("/mortgage", {
      state: {
        formData: {
          housePrice: priceNum,
          savings: savingsNum,
          houseType: houseType,
          city: city,
          growthRate: growthRate,
          savingOption: savingOption,
          questionnaireAnswers: questionnaireAnswers,
          currency,            // Pass selected currency forward
          yearsToSave: yearsToSave,
          downPaymentPct,
          customPct
        },
        futurePrice,           // Computed future home price
        yearlyArray            // Yearly savings breakdown
      }
    });
  };

  function calculateMonthlyInvestment({ futurePrice, currentSavings, averageCompoundReturn, managementFee, yearsToSave }) {
      const returnRate = (averageCompoundReturn - managementFee) / 100; // Convert % to decimal
      const r = returnRate / 12;
      const totalMonths = yearsToSave * 12;

      const futureValueOfSavings = currentSavings * Math.pow(1 + r, totalMonths);
      const numerator = futurePrice - futureValueOfSavings;
      const denominator = (Math.pow(1 + r, totalMonths) - 1) / r;

      const monthlyInvestment = numerator / denominator;
      return Math.max(0, Math.round(monthlyInvestment));
    }

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="container">
      <PlanTabs />

      <div className="cards">
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* LEFT: INPUT FORM                                            */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div className="card input-card">
          <h2 className="card-title">
            FIRST PHASE: <span className="highlight">DOWNPAYMENT</span>
          </h2>
          <p className="card-subtitle">
            Let’s begin by learning about your dream home and what you currently have saved!
          </p>

          <div className="form-row-double">
            {/* HOUSE PRICE */}
            <div className="form-col">
              <label>HOUSE PRICE</label>
              <div className="input-group">
                <input
                  type="text"               // Use text to allow commas
                  placeholder="Enter amount"
                  value={housePriceInput}
                  onChange={handleHousePriceChange}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="VND">₫</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>

            {/* SAVINGS */}
            <div className="form-col">
              <label>SAVINGS</label>
              <div className="input-group">
                <input
                  type="text"               // Use text to allow commas
                  placeholder="Enter amount"
                  value={savingsInput}
                  onChange={handleSavingsChange}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="VND">₫</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>
          </div>

             {/* ── NEW TRIPLE ROW: CITY • HOUSE TYPE • PRICE GROWTH ─────────────────── */}
                <div className="form-row-triple">
                  {/* CITY */}
                  <div className="form-col">
                    <label>CITY</label>
                    <div className="input-group">
                      <FaMapMarkerAlt className="icon" />
                      <select value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="Hanoi">Hanoi</option>
                        <option value="HoChiMinh">Ho Chi Minh City</option>
                        <option value="Danang">Da Nang</option>
                      </select>
                    </div>
                  </div>
          
                  {/* HOUSE TYPE */}
                  <div className="form-col">
                    <label>HOUSE TYPE</label>
                    <div className="input-group">
                      <FaHome className="icon" />
                      <select value={houseType} onChange={(e) => setHouseType(e.target.value)}>
                        <option value="Apartment">Apartment</option>
                        <option value="Ground-houses">Ground Houses</option>
                      </select>
                    </div>
                  </div>
          
                  {/* PRICE GROWTH – auto filled */} 
                  <div className="form-col">
                    <label>PRICE GROWTH</label>
                    <div className="input-group">
                      <FaChartLine className="icon" />
                      <input
                        type="text"
                        readOnly
                        value={`${growthRate}%`}
                        style={{
                          maxWidth: "48px",
                          border: "none",
                          backgroundColor: "#f9fafb", // light gray
                          color: "#1f2937", // slate-800
                        }}
                      />
                    </div>
                  </div>
                </div>

          <div className="form-row-double">
          {/* YEARS WILLING TO SAVE */}
            <div className="form-col">
              <label>YEARS WILLING TO SAVE</label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={yearsToSave}
                  onChange={(e) => setYearsToSave(e.target.value)}
                />
              </div>
            </div>

          {/* DOWNPAYMENT GOAL */}
          <div className="form-col">
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
          </div>

          <div className="form-row">
            <label>
              SAVINGS OPTION <FaInfoCircle style={{ marginLeft: '4px' }} />
            </label>
            <div className="input-group">
              <FaHandHoldingUsd className="icon" />
              <select
                value={savingOption}
                onChange={(e) => setSavingOption(e.target.value)}
              >
                <option value="bank">Banking</option>
                <option value="mutual-funds">Mutual Funds</option>
              </select>
            </div>
          </div>

         
          {!showResult && savingOption === "mutual-funds" && (
              <MutualFundQuestionnaire
                yearsToSave={yearsToSave}
                onRecommend={({ recommendation, answers }) => {
                  setRecommendedFunds(recommendation);
                  setQuestionnaireAnswers(answers);
                }}
              />
            )}

             <div className="check-btn-wrapper">
            <button className="check-btn" onClick={handleCheckSavingsPlan}>
              CHECK SAVINGS PLAN
            </button>
          </div>


        </div>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* RIGHT: RESULT & CHART                                         */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div className="card result-card">
          <h2 className="card-title">
            <span className="highlight">RESULT</span>
          </h2>

          {/* Show explanation before result */}
            {!showResult && (
              <div style={{ marginTop: "1.5rem" }}>
                {savingOption === "bank" && <BankCard />}
                {savingOption === "mutual-funds" && <MutualFundCard />}
                
              </div>
            )}

               {showResult && recommendedFunds.length > 0 && savingOption === "mutual-funds" && (

          <div className="fund-result-card">
            <p className="card-subtitle">
              Based on your information, the suitable fund certificate(s) for you is/are:
            </p>
            <table className="fund-table">
              <thead>
                <tr>
                  <th>Fund Type</th>
                  <th>Fund</th>
                  <th>Average Compound Return</th>
                  <th>Management Fee</th>
                  <th>Monthly Investment</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Equity Fund (High return, high risk)",
                    fund: "VINACAPITAL-VEOF",
                    return: "17,80%",
                    fee: "1,75%",
                  },
                  {
                    type: "",
                    fund: "VINACAPITAL-VESAF",
                    return: "21,90%",
                    fee: "1,75%",
                  },
                  {
                    type: "Bond Fund (Stable return, low risk)",
                    fund: "VINACAPITAL-VFF",
                    return: "7,50%",
                    fee: "0,95%",
                  },
                  {
                    type: "Balanced Fund (Combination of stocks and bonds)",
                    fund: "VINACAPITAL-VIBF",
                    return: "13,80%",
                    fee: "1,75%",
                  },
                  {
                    type: "ETF (Index-tracking fund)",
                    fund: "FUEVN100",
                    return: "13,50%",
                    fee: "0,67%",
                  },
                ].map((row) => (
                  <tr
                    key={row.fund}
                    className={recommendedFunds.includes(row.fund) ? "highlight-row" : ""}
                  >
                    <td>{row.type}</td>
                    <td>{row.fund}</td>
                    <td>{row.return}</td>
                    <td>{row.fee}</td>
                    <td>
                      {showResult
                        ? calculateMonthlyInvestment({
                            futurePrice: futurePrice,
                            currentSavings: parseNumber(savingsInput),
                            averageCompoundReturn: parseFloat(row.return.replace(",", ".")),
                            managementFee: parseFloat(row.fee.replace(",", ".")),
                            yearsToSave: parseInt(yearsToSave, 10)
                          }).toLocaleString("en-US") + ` ${currencySymbols[currency]}`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          
            <p className="followup-line">
                Are you ready for the <strong style={{ color: "#8F00FF" }}>next part</strong> of
                your saving plan? You can always come back to change variables!
              </p>

              <button className="next-btn" onClick={handleNext}>
                NEXT
              </button>
          </div>
        )}

          {showResult  && savingOption == "bank" && (
            <>
              {/* Summary line: show monthly savings plus currency symbol */}
              <p className="summary-line">
                You need to save{" "}
                <strong style={{ color: "#0088FF" }}>
                  {monthlySavings.toLocaleString("en-US")}{" "}
                  {currencySymbols[currency]}
                </strong>{" "}
                per month for <strong>{Number(yearsToSave) * 12}</strong> months to reach your goal.
              </p>

              {/* Bar chart showing yearly savings */}
              {yearlyArray.length > 0 && (
                <div style={{ position: "relative", height: "350px" }}>
                  <Bar
                    data={{
                      labels: yearlyArray.map((_, idx) => `Year ${idx + 1}`),
                      datasets: [
                        {
                          label: `Projected Savings (${currencySymbols[currency]})`,
                          data: yearlyArray.map((e) => e.value),
                          backgroundColor: "#00C2FF",
                          borderRadius: 4
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,

                      // Y‐axis ticks use commas + currency symbol
                      scales: {
                        y: {
                          ticks: {
                            callback: (value) =>
                              value.toLocaleString("en-US") +
                              ` ${currencySymbols[currency]}`
                          }
                        }
                      },

                      // Tooltip configuration for hover pop‐ups
                      plugins: {
                        tooltip: {
                          enabled: true,
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff",
                          padding: 8,
                          callbacks: {
                            title: (tooltipItems) => tooltipItems[0].label, // e.g. "Year 1"
                            label: (tooltipItem) => {
                              const rawValue = tooltipItem.parsed.y;
                              return (
                                rawValue.toLocaleString("en-US") +
                                ` ${currencySymbols[currency]}`
                              );
                            }
                          },
                          titleFont: {
                            size: 14,
                            weight: "bold"
                          },
                          bodyFont: {
                            size: 12
                          }
                        },

                        // Hide the default legend (optional)
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              )}

              <p className="followup-line">
                Are you ready for the <strong style={{ color: "#8F00FF" }}>next part</strong> of
                your saving plan? You can always come back to change variables!
              </p>

              <button className="next-btn" onClick={handleNext}>
                NEXT
              </button>
            </>
          ) }
        </div>
      </div>
    </div>
  );
}

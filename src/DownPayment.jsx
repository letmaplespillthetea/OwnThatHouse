// src/DownPayment.jsx
import React, { useState, useEffect } from 'react';
import { FaPercent } from 'react-icons/fa';
import './form.css';
import { useNavigate } from 'react-router-dom';
import PlanTabs from "./PlanTabs";
import { stripNonDigits, formatWithCommas, parseNumber } from "./utils/numberFormatting";
import {
  FaMapMarkerAlt,
  FaHome,
  FaChartLine,
} from "react-icons/fa";

export default function DownPayment() {
  const navigate = useNavigate();

  // 1) Keep track of which currency the user has selected.
  //    Possible values are 'VND', 'USD', 'EUR'.
  const [currency, setCurrency] = useState('VND');

  // 2) Create a simple mapping from the currency code to its symbol.
  const currencySymbols = {
    VND: '₫',
    USD: '$',
    EUR: '€'
  };

  const [city, setCity] = useState("Hanoi");
  const [houseType, setHouseType] = useState("Apartment");
  const [growthRate, setGrowthRate] = useState("12");

  // We store the input fields as strings that include commas.
  const [housePriceInput, setHousePriceInput] = useState('');
  const [savingsInput, setSavingsInput] = useState('');
  const [downPaymentPct, setDownPaymentPct] = useState('30');
  const [customPct, setCustomPct] = useState('');

  const parseString = (str) => {
  if (typeof str !== "string") return "";
  return str.trim(); // loại bỏ khoảng trắng đầu/cuối
};

  // Computed results (as Numbers):
  const [presentAmt, setPresentAmt] = useState(null);
  const [missingAmt, setMissingAmt] = useState(null);

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

  useEffect(() => {
    const growth =
      growthRateMap[city]?.[houseType] ?? "8"; // fallback default
    setGrowthRate(growth);
  }, [city, houseType]);


  // Live‐format HOUSE PRICE on each keystroke:
  const handleHousePriceChange = (e) => {
    const raw = stripNonDigits(e.target.value);         // remove existing commas/letters
    const formatted = formatWithCommas(raw);            // reinsert commas
    setHousePriceInput(formatted);
  };

  // Live‐format SAVINGS on each keystroke:
  const handleSavingsChange = (e) => {
    const raw = stripNonDigits(e.target.value);
    const formatted = formatWithCommas(raw);
    setSavingsInput(formatted);
  };

  // When the user clicks “CHECK”:
  const handleCheck = () => {
    // 1) Convert comma‐formatted strings back to Numbers:
    const price = parseNumber(housePriceInput);         // e.g. "1,000,000" → 1000000
    const currentSavings = parseNumber(savingsInput);

    // 2) Determine which down‐payment % to apply (default vs custom)
    const selectedPct =
      downPaymentPct === 'custom'
        ? parseFloat(customPct) || 0
        : parseFloat(downPaymentPct) || 0;

    // 3) Compute required amount (down‐payment % of price + 1.5% buffer)
    const requiredAmt = price * (selectedPct / 100 + 0.015);

    // 4) Compute “missing” = requiredAmt − currentSavings
    const missing = requiredAmt - currentSavings;

    // 5) Store results in state (rounded to 2 decimals).
    setPresentAmt(parseFloat(requiredAmt.toFixed(2)));
    setMissingAmt(missing <= 0 ? 0 : parseFloat(missing.toFixed(2)));
  };

  return (
    <div className="container">
      <PlanTabs />
      <div className="cards">
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* LEFT CARD: INPUT FIELDS                                      */}
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
                  type="text"                   // Must be text so we can show commas
                  placeholder="Enter amount"
                  value={housePriceInput}
                  onChange={handleHousePriceChange}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
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
                  type="text"                   // Must be text so we can show commas
                  placeholder="Enter amount"
                  value={savingsInput}
                  onChange={handleSavingsChange}
                />
                <select
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

          <div className="form-tip">
            TIPS: Click the drop down button to change currency!
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

          {/* DOWNPAYMENT GOAL */}
          <div className="form-row">
            <label>DOWNPAYMENT GOAL</label>
            <div className="input-group">
              <FaPercent className="icon" />
              <select
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(e.target.value)}
              >
                <option value="30">30% - Default</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
                <option value="custom">Custom</option>
              </select>
              {downPaymentPct === 'custom' && (
                <input
                  type="number"
                  placeholder="%"
                  value={customPct}
                  onChange={(e) => setCustomPct(e.target.value)}
                  style={{ marginLeft: '8px', width: '60px' }}
                />
              )}
            </div>
          </div>

          <div className="check-btn-wrapper">
            <button className="check-btn" onClick={handleCheck}>
              CHECK
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* RIGHT CARD: RESULT                                            */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div className="card result-card">
          <h2 className="card-title">
            <span className="highlight">RESULT</span>
          </h2>

          {presentAmt !== null ? (
            missingAmt <= 0 ? (
              <div className="result-success">
                <p className="summary-line">
                  You have <strong>enough</strong> savings to cover your selected down payment and estimated upfront costs!
                </p>
                <p className="followup-line">
                  Explore your <strong>mortgage plan</strong> and check <strong>income eligibility</strong>.
                </p>
                <button
                  className="next-btn"
                  onClick={() =>
                    navigate('/mortgage', {
                      state: {
                        formData: {
                          housePrice: parseNumber(housePriceInput),
                          savings: parseNumber(savingsInput),
                          currency,
                          downPaymentPct,
                          customPct
                        },
                        presentPrice: parseNumber(housePriceInput),
                        savings: parseNumber(savingsInput)
                      }
                    })
                  }
                >
                  NEXT
                </button>
              </div>
            ) : (
              <div className="result-warning">
                <p className="summary-line">
                  You <strong>don’t have enough</strong> for the purchase yet.
                </p>
                <p className="followup-line">
                  You’ll need an additional{' '}
                  <strong>
                    {missingAmt.toLocaleString('en-US')}{" "}
                    {currencySymbols[currency]}
                  </strong>{' '}
                  at present.
                </p>
                <p className="followup-line">
                  But this number may become <strong>bigger</strong> if house prices grow.
                </p>
                <p className="action-line">
                  Let’s create a plan to save it! This requires <strong>additional input</strong>.
                </p>
                <button
                  className="next-btn"
                  onClick={() =>
                    navigate('/saving-plan', {
                      state: {
                        formData: {
                          housePrice: parseNumber(housePriceInput),
                          savings: parseNumber(savingsInput),
                          growthRate: parseNumber(growthRate),
                          city: parseString(city),
                          houseType: parseString(houseType),
                          currency,
                          downPaymentPct,
                          customPct
                        },
                        housePrice: parseNumber(housePriceInput),
                        savings: parseNumber(savingsInput)
                      }
                    })
                  }
                >
                  CREATE SAVINGS PLAN
                </button>
              </div>
            )
          ) : (
            <p className="card-subtitle">
              You have not entered any information!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

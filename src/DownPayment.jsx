import React, { useState, useRef } from 'react';
import { FaPercent } from 'react-icons/fa';
import './form.css';
import { useNavigate } from 'react-router-dom';
import LoanAboutCard from './components/LoanAboutCard';
import PlanTabs from "./PlanTabs";
import { usePlans } from "./PlanContext";

export default function DownPayment() {
  const navigate = useNavigate();
  const swiperRef = useRef();

  const [housePrice, setHousePrice] = useState('');
  const [savings, setSavings] = useState('');
  const [downPaymentPct, setDownPaymentPct] = useState('30');
  const [customPct, setCustomPct] = useState('');
  const [currency, setCurrency] = useState('VND');

  const [presentAmt, setPresentAmt] = useState(null);
  const [missingAmt, setMissingAmt] = useState(null);

  const handleCheck = () => {
    const price = parseFloat(housePrice) || 0;
    const currentSavings = parseFloat(savings) || 0;
    const selectedPct = downPaymentPct === 'custom' ? parseFloat(customPct) : parseFloat(downPaymentPct);
    const requiredAmt = price * (selectedPct / 100 + 0.015);
    const missing = requiredAmt - currentSavings;

    setPresentAmt(requiredAmt.toFixed(2));
    setMissingAmt(missing <= 0 ? 0 : missing);
  };

  return (
    <div className="container">
      <PlanTabs />
      <div className="cards">
        {/* LEFT: INPUT */}
        <div className="card input-card">
          <h2 className="card-title">
            FIRST PHASE: <span className="highlight">DOWNPAYMENT</span>
          </h2>
          <p className="card-subtitle">
            Let’s begin by learning about your dream home and what you currently have saved!
          </p>

          <div className="form-row-double">
            <div className="form-col">
              <label>HOUSE PRICE</label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={housePrice}
                  onChange={(e) => setHousePrice(e.target.value)}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="VND">₫</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>

            <div className="form-col">
              <label>SAVINGS</label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="VND">₫</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-tip">TIPS: Click the drop down button to change currency!</div>

          <div className="form-row">
            <label>DOWNPAYMENT GOAL</label>
            <div className="input-group">
              <FaPercent className="icon" />
              <select value={downPaymentPct} onChange={(e) => setDownPaymentPct(e.target.value)}>
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
            <button className="check-btn" onClick={handleCheck}>CHECK</button>
          </div>
        </div>

        {/* RIGHT: RESULT */}
        <div className="card result-card">
          <h2 className="card-title"><span className="highlight">RESULT</span></h2>

          {presentAmt != null && savings != null ? (
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
                              housePrice,
                              savings,
                              currency,
                              downPaymentPct,
                              customPct
                            }, presentPrice: housePrice, savings
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
                      You’ll need an additional <strong>{missingAmt.toLocaleString()} VND</strong> at present.
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
                        navigate("/saving-plan", {
                          state: {
                            formData: {
                              housePrice,
                              savings,
                              currency,
                              downPaymentPct,
                              customPct
                            }, housePrice, savings
                          }
                        })

                      }
                    >
                      CREATE SAVINGS PLAN
                    </button>
                                   <LoanAboutCard/>
                  </div> 

            )
          ) : (
            <p className="card-subtitle">You have not entered any information!</p>
          )}
        </div>
      </div>
    </div>
  );
}

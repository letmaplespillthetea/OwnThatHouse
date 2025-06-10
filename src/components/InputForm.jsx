// InputForm.jsx
import React from "react";
import { FaMapMarkerAlt, FaHome, FaChartLine, FaPercent, FaHandHoldingUsd, FaClock } from "react-icons/fa";

const InputForm = ({
  housePrice,
  savings,
  income,
  expenses,
  city,
  houseType,
  growthRate,
  downPaymentPct,
  customPct,
  yearsToSave,
  savingOption,
  mortgageTerm,
  customTerm,
  currency,
  setHousePrice,
  setSavings,
  setIncome,
  setExpenses,
  setCity,
  setHouseType,
  setDownPaymentPct,
  setCustomPct,
  setYearsToSave,
  setSavingOption,
  setTerm,
  setCustomTerm,
  setCurrency,
  readOnly = false,
}) => {
  const renderCurrencyInput = (label, value, setter, id) => (
    <div className="form-col">
      <label htmlFor={id}>{label}</label>
      <div className="input-group">
        <span className="currency-toggle">
          {currency === "VND" ? "million ₫" : currency === "USD" ? "$" : "€"}
        </span>
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => setter?.(e.target.value)}
          placeholder="million"
          readOnly={readOnly}
        />
        <span className="unit-label">million</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="form-row-double">
        {renderCurrencyInput("HOUSE PRICE", housePrice, setHousePrice, "house-price")}
        {renderCurrencyInput("SAVINGS", savings, setSavings, "savings")}
      </div>

      <div className="form-row-triple">
        <div className="form-col">
          <label>CITY</label>
          <div className="input-group">
            <FaMapMarkerAlt className="icon" />
            <select value={city} onChange={(e) => setCity?.(e.target.value)} disabled={readOnly}>
              <option value="Hanoi">Hanoi</option>
              <option value="HoChiMinh">Ho Chi Minh City</option>
              <option value="Danang">Da Nang</option>
            </select>
          </div>
        </div>

        <div className="form-col">
          <label>HOUSE TYPE</label>
          <div className="input-group">
            <FaHome className="icon" />
            <select value={houseType} onChange={(e) => setHouseType?.(e.target.value)} disabled={readOnly}>
              <option value="Apartment">Apartment</option>
              <option value="Ground-houses">Ground Houses</option>
            </select>
          </div>
        </div>

        <div className="form-col">
          <label>PRICE GROWTH</label>
          <div className="input-group">
            <FaChartLine className="icon" />
            <input
              type="text"
              value={`${growthRate}%`}
              readOnly
              style={{ maxWidth: "48px", border: "none", backgroundColor: "#f9fafb" }}
            />
          </div>
        </div>
      </div>

      <div className="form-row-double">
        <div className="form-col">
          <label>DOWNPAYMENT GOAL</label>
          <div className="input-group">
            <FaPercent className="icon" />
            <select value={downPaymentPct} onChange={(e) => setDownPaymentPct?.(e.target.value)} disabled={readOnly}>
              <option value="30">30% - Default</option>
              <option value="40">40%</option>
              <option value="50">50%</option>
              <option value="custom">Custom</option>
            </select>
            {downPaymentPct === "custom" && (
              <input
                type="number"
                value={customPct}
                onChange={(e) => setCustomPct?.(e.target.value)}
                placeholder="%"
                style={{ marginLeft: "8px", width: "60px" }}
                readOnly={readOnly}
              />
            )}
          </div>
        </div>

        <div className="form-col">
          <label>YEARS WILLING TO SAVE</label>
          <div className="input-group">
            <FaClock className="icon" />
            <input
              type="number"
              value={yearsToSave}
              onChange={(e) => setYearsToSave?.(e.target.value)}
              placeholder="e.g. 3"
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      <div className="form-row-double">
        <div className="form-col">
          <label>SAVINGS OPTION</label>
          <div className="input-group">
            <FaHandHoldingUsd className="icon" />
            <select value={savingOption} onChange={(e) => setSavingOption?.(e.target.value)} disabled={readOnly}>
              <option value="bank">Banking</option>
              <option value="mutual-funds">Mutual Funds</option>
            </select>
          </div>
        </div>

        {renderCurrencyInput("CURRENT INCOME", income, setIncome, "income")}
      </div>

      <div className="form-row-double">
        {renderCurrencyInput("CURRENT EXPENSES", expenses, setExpenses, "expenses")}
        <div className="form-col">
          <label>MORTGAGE TERM</label>
          <div className="input-group">
            <select value={mortgageTerm} onChange={(e) => setTerm?.(e.target.value)} disabled={readOnly}>
              <option value="20">20 Years</option>
              <option value="30">30 Years</option>
              <option value="40">40 Years</option>
              <option value="custom">Custom</option>
            </select>
            {mortgageTerm === "custom" && (
              <input
                type="number"
                value={customTerm}
                onChange={(e) => setCustomTerm?.(e.target.value)}
                placeholder="Years"
                style={{ width: "80px", marginLeft: "8px" }}
                readOnly={readOnly}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InputForm;

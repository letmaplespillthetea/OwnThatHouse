import React from "react";
import { FaPercent } from "react-icons/fa";

const InputForm = ({
  housePrice,
  setHousePrice,
  savings,
  setSavings,
  income,
  setIncome,
  expenses,
  setExpenses,
  downPaymentPct,
  setDownPaymentPct,
  customPct,
  setCustomPct,
  mortgageTerm,
  setTerm,
  customTerm,
  setCustomTerm,
  currency,
  setCurrency,
}) => {
  return (
    <div>
      {/* Row 1: House Price & Savings */}
      <div className="form-row-double">
        <div className="form-col">
          <label htmlFor="house-price">HOUSE PRICE</label>
          <div className="input-group">
            <input
              id="house-price"
              type="number"
              placeholder="Enter amount"
              value={housePrice}
              onChange={(e) => setHousePrice(e.target.value)}
              min="0"
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
          <label htmlFor="savings">SAVINGS</label>
          <div className="input-group">
            <input
              id="savings"
              type="number"
              placeholder="Enter amount"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              min="0"
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

      {/* Row 2: Income & Expenses */}
      <div className="form-row-double">
        <div className="form-col">
          <label htmlFor="income">CURRENT INCOME</label>
          <div className="input-group">
            <input
              id="income"
              type="number"
              placeholder="Enter amount"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              min="0"
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
          <label htmlFor="expenses">CURRENT EXPENSES</label>
          <div className="input-group">
            <input
              id="expenses"
              type="number"
              placeholder="Enter amount"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              min="0"
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

      <div className="form-row-double">
      {/*Downpayment Goal */}
      <div className="form-col">
        <label htmlFor="downpayment-goal">DOWNPAYMENT GOAL</label>
        <div className="input-group">
          <FaPercent className="icon" />
          <select
            id="downpayment-goal"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(e.target.value)}
          >
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
              min="0"
              max="100"
            />
          )}
        </div>
      </div>

      {/*Row 4: Mortgage Term */}
      <div className="form-col">
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
          {mortgageTerm === "custom" && (
            <input
              type="number"
              placeholder="Years"
              value={customTerm}
              onChange={(e) => setCustomTerm(e.target.value)}
              style={{ width: "80px", marginLeft: "8px" }}
              min="1"
            />
          )}
        </div>
      </div>
    </div> </div>
  );
};

export default InputForm;

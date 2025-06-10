// FinalPlan.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./form.css";
import InputForm from "./components/InputForm";
import PlanTabs from "./PlanTabs";
import { usePlans } from "./PlanContext";
import ExportFinalPlan from "./components/ExportFinalPlan";
import MutualFundReview from "./components/MutualFundReview";

const FinalPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qualified = location.state?.status;
  console.log(qualified);
  const { activePlan, setActivePlan, markPlanComplete } = usePlans();
  const { formData = {}, status } = location.state || {};
  const yearlyArray = location.state?.yearlyArray || {};
  const scheduleMonthFull = location.state?.scheduleMonthFull || {};
  const scheduleYearFull = location.state?.scheduleYearFull || {};

console.log(yearlyArray);

const {
  housePrice = '',
  savings = '',
  currency = 'VND',
  downPaymentPct = '30',
  city = 'Hanoi',
  houseType = 'apartment',
  customPct = '',
  growthRate = '',
  yearsToSave = '',
  income = '',
  expenses = '',
  savingOption = '',
  mortgageTerm = '20',
  customTerm = '',
} = formData;

const {
  estimatedLoan,
  maxPrice,
  filteredURL
} = calculateMaxAffordablePrice({
  income,
  expenses,
  growthRate,
  downPaymentPct,
  mortgageTerm,
  yearsToSave,
  houseType,
  city
});


  const questionnaireAnswers = location.state?.formData?.questionnaireAnswers || {};

  function calculateMaxAffordablePrice({
    income,
    expenses,
    growthRate,
    downPaymentPct,
    mortgageTerm,
    yearsToSave,
    houseType,
    city
  }) {
    const incomeNum = Number(income) || 0;
    const expensesNum = Number(expenses) || 0;
    const netIncome = incomeNum - expensesNum;
    const numPayments = (parseInt(mortgageTerm, 10) || 0) * 12;

    // Estimated Loan Calculation
    const denominator = (1 / numPayments) + 0.08 - (2.88 / numPayments);
    const estimatedLoan = netIncome / denominator;

    // Max Affordable Price Calculation
    const years = parseInt(yearsToSave, 10) || 0;
    const growth = parseFloat(growthRate) / 100 || 0;
    const downPct =
      downPaymentPct === "custom"
        ? 0.3
        : parseFloat(downPaymentPct) / 100;

    const maxAffordablePrice =
      estimatedLoan / (Math.pow(1 + growth, years) * (1 - downPct));
    const maxPriceRounded = Math.round(maxAffordablePrice);

    // Price bracket logic
    let priceBracket = "";
    const priceMil = Math.round(maxPriceRounded / 1_000_000);
    if (priceMil <= 500) priceBracket = "gia-duoi-500-trieu";
    else if (priceMil <= 800) priceBracket = "gia-tu-500-trieu-den-800-trieu";
    else if (priceMil <= 1000) priceBracket = "gia-tu-800-trieu-den-1-ty";
    else if (priceMil <= 2000) priceBracket = "gia-tu-1-ty-den-2-ty";
    else if (priceMil <= 3000) priceBracket = "gia-tu-2-ty-den-3-ty";
    else if (priceMil <= 5000) priceBracket = "gia-tu-3-ty-den-5-ty";
    else if (priceMil <= 7000) priceBracket = "gia-tu-5-ty-den-7-ty";
    else if (priceMil <= 10000) priceBracket = "gia-tu-7-ty-den-10-ty";
    else if (priceMil <= 20000) priceBracket = "gia-tu-10-ty-den-20-ty";
    else if (priceMil <= 30000) priceBracket = "gia-tu-20-ty-den-30-ty";
    else if (priceMil <= 40000) priceBracket = "gia-tu-30-ty-den-40-ty";
    else if (priceMil <= 60000) priceBracket = "gia-tu-40-ty-den-60-ty";
    else priceBracket = "gia-tren-60-ty";

    // City slug
    const citySlugMap = {
      "Hanoi": "ha-noi",
      "Danang": "da-nang",
      "HoChiMinh": "tp-hcm"
    };
    const citySlug = citySlugMap[city] || "ha-noi";

    // Property slug
    const propertySlugMap = {
      "Apartment": "can-ho-chung-cu",
      "Ground-houses": "nha-rieng"
    };
    const propertySlug = propertySlugMap[houseType] || "can-ho-chung-cu";

    const url = `https://batdongsan.com.vn/ban-${propertySlug}-${citySlug}/${priceBracket}`;

    return {
      estimatedLoan: Math.round(estimatedLoan),
      maxPrice: maxPriceRounded,
      filteredURL: url
    };
  }



  const handleNext = () => {
    markPlanComplete();

    if (activePlan < 5) {
      setActivePlan(activePlan + 1);
      navigate("/downpayment");
    } else {
      alert("🎉 All plans completed!");
    }
  };


  return (
    <div className="container">
        <PlanTabs />

      <div className="cards">

        {/* LEFT COLUMN */}
        <div className="card input-card">
          <h2 className="card-title">
            3RD PHASE: <span className="highlight">FINAL PLAN</span>
          </h2>
          <p className="card-subtitle">
            Here is a complete list of all inputs you have entered so far. You can  come back to previous steps to change any inputs to your liking!
          </p>

          {/* Form fields */}
          <InputForm
            housePrice={housePrice}
            savings={savings}
            income={income}
            expenses={expenses}
            downPaymentPct={downPaymentPct}
            customPct={customPct}
            mortgageTerm={mortgageTerm}
            customTerm={customTerm}
            city={city}
            houseType={houseType}
            growthRate={growthRate}
            currency={currency}
            yearsToSave={yearsToSave}
            savingOption={savingOption}
            readOnly={true}
        />

        {savingOption === "mutual-funds" && (
          <MutualFundReview answers={questionnaireAnswers} />
        )}

          <button className="next-btn" onClick={handleNext}>
            NEXT PLAN
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="card result-card">
          <h2 className="card-title">
            <span className="highlight">RESULT</span>
          </h2>

          {qualified ? (
            <div className="result-success">
              <p className="summary-line">
                Great news! Based on your current income, you meet the minimum financial requirement to qualify for this loan.
              </p>
              <p className="followup-line">
                You can apply online through <strong><span style={{ color: "#006C68" }}>BIDV’s official website</span></strong> or visit a <strong><span style={{ color: "#006C68" }}>BIDV branch</span></strong> to complete your application.
              </p>
              <p className="followup-line">
                You can also click the <strong>EXPORT</strong> button to save a comprehensive copy of this particular result!
              </p>
              <ExportFinalPlan
                scheduleMonthFull={scheduleMonthFull}
                scheduleYearFull={scheduleYearFull}
                yearlyArray={yearlyArray}
              />
            </div>
          ) : (
            <div className="result-warning" style={{ color: "#2563eb", fontSize: "0.95rem" }}>
              <p className="summary-line" style={{ marginBottom: "0.75rem" }}>
                <span role="img" aria-label="warning" style={{ marginRight: "4px" }}>❗</span>
                Unfortunately, your current income <strong>does not meet</strong> the minimum required to qualify for this loan.
              </p>

              <p style={{ marginBottom: "0.75rem", fontWeight: "500" }}>
                We’ll help you explore better options:
              </p>

              <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", lineHeight: "1.6" }}>
                <li>
                  <strong>Reduce</strong> your target home price → choose a lower budget. After calculation, the maximum house price you can afford with the current down payment plan is 
                  <strong> {maxPrice.toLocaleString("en-US")} {currency}</strong> → You can visit 
                  <a href={filteredURL} target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b", fontWeight: 600, marginLeft: 4 }}>
                    this website
                  </a>{" "}to diversify your options.
                </li><br/>
                <li><strong>Adjust</strong> your mortgage plan → Try increasing the loan term to reduce monthly repayment.</li><br/>
                <li><strong>Save</strong> more upfront → Build a larger down payment to reduce the loan size.</li>
              </ul>
              <ExportFinalPlan
                scheduleMonthFull={scheduleMonthFull}
                scheduleYearFull={scheduleYearFull}
                yearlyArray={yearlyArray}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalPlan;

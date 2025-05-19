// FinalPlan.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./form.css";
import InputForm from "./components/InputForm";
import PlanTabs from "./PlanTabs";
import { usePlans } from "./PlanContext";
import ExportFinalPlan from "./components/ExportFinalPlan";

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
  customPct = '',
  growthRate = '',
  yearsToSave = '',
  income = '',
  expenses = '',
  mortgageTerm = '20',
  customTerm = '',
} = formData;

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
            You should have familiarized yourself with the process by now. Here is a complete list of all variables you have entered thus far, so that you don’t have to navigate back to make changes or for a new plan!
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
            currency={currency}
            readOnly={true}
        />


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
                You can apply online through <strong>BIDV’s official website</strong> or visit a BIDV branch to complete your application.
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
            <div className="result-warning">
              <p className="summary-line">
                Unfortunately, your current income <strong>does not meet</strong> the minimum required to qualify for this loan.
              </p>
              <p className="followup-line">Let’s help you explore better options:</p>
              <ul className="suggestions">
                <li>🔹 Reduce your target home price → choose a lower budget</li>
                <li>🔹 Adjust your mortgage plan → Try increasing the loan term</li>
                <li>🔹 Save more upfront → Build a larger down payment to reduce the loan size</li>
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

import React from "react";
import "./savingplan.css";

export default function BankCard() {
  return (
    <div className="saving-plan-card">
      {/* Title Section */}
      <h2 className="saving-plan-title">ABOUT</h2>

      {/* Subheading */}
      <h3 className="saving-plan-subtitle">
        BIDV SAVINGS INTEREST RATE
      </h3>

      {/* Description */}
      <p className="saving-plan-description">
        You may want to take a look at BIDV’s Saving Program for Home Ownership
        (can be easily accessed through
        <span className="highlight"> BIDV Smart Banking App</span>). Here is the interest
        rates for each savings term for reference!
      </p>

      {/* Table */}
      <div className="saving-plan-table-container">
        <table className="saving-plan-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Interest Rate</th>
            </tr>
          </thead>
          <tbody>
            {[
              { term: "12 Months", rate: "4,00%" },
              { term: "24 Months", rate: "4,20%" },
              { term: "36 Months", rate: "4,20%" },
              { term: "48 Months", rate: "4,20%" },
              { term: "60 Months", rate: "4,20%" },
            ].map((item, idx) => (
              <tr key={idx}>
                <td>{item.term}</td>
                <td>{item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

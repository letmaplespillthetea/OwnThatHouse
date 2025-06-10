import React from "react";
import "./savingplan.css";

export default function MutualFundCard() {
  return (
    <div className="saving-plan-card">
      {/* Mutual Fund Section */}
      <h2 className="saving-plan-title mt-6">BIDV-<span className="text-amber-500">VINACAPITAL</span> MUTUAL FUNDS</h2>
      <p className="saving-plan-description">
        Currently, BIDV is collaborating with <span className="highlight">Vinacapital</span> to support investors in easily purchasing fund certificates through the <span className="highlight">BIDV Smartbanking app</span>. Their information is displayed below:
      </p>

      <div className="saving-plan-table-container">
        <table className="saving-plan-table">
          <thead>
            <tr>
              <th>Fund Type</th>
              <th>Fund</th>
              <th>Average Compound Return Over 5 Years</th>
              <th>Management Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan="2">
                Equity Fund <br />
                <span className="text-xs text-gray-500">(High return, high risk)</span>
              </td>
              <td>
                <strong>VINACAPITAL-VEOF</strong>
                <br />
              </td>
              <td>17,80%</td>
              <td>1,75%</td>
            </tr>
            <tr>
              <td>
                <strong>VINACAPITAL-VESAF</strong>
                <br />
     
              </td>
              <td>21,90%</td>
              <td>1,75%</td>
            </tr>
            <tr>
              <td>
                Bond Fund <br />
                <span className="text-xs text-gray-500">(Stable return, low risk)</span>
              </td>
              <td>
                <strong>VINACAPITAL-VFF</strong>
                <br />
              </td>
              <td>7,50%</td>
              <td>0,95%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

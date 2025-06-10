import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaDotCircle,
  FaChartLine,
  FaUserTie
} from "react-icons/fa";
import "./questionnaire.css";

export default function MutualFundQuestionnaire({ yearsToSave, onRecommend }) {
  const [q1, setQ1] = useState("4");
  const [q2, setQ2] = useState("4");
  const [q3, setQ3] = useState("1");
  const [q4, setQ4] = useState("4");

  useEffect(() => {
    const points = [q1, q2, q3, q4].map(Number).reduce((a, b) => a + b, 0);
    const years = parseInt(yearsToSave || "1", 10);

    let recommendation = [];

    if (years <= 5) {
      if (points >= 4 && points <= 16) recommendation = ["VINACAPITAL-VFF"];
    } else if (years <= 10) {
      if (points >= 4 && points <= 8) recommendation = ["VINACAPITAL-VFF"];
      else if (points >= 9 && points <= 16) recommendation = ["VINACAPITAL-VIBF", "FUEVN100"];
    } else {
      if (points >= 4 && points <= 8) recommendation = ["VINACAPITAL-VFF"];
      else if (points >= 9 && points <= 12) recommendation = ["VINACAPITAL-VIBF", "FUEVN100"];
      else if (points >= 13 && points <= 16) recommendation = ["VINACAPITAL-VEOF", "VINACAPITAL-VESAF"];
    }

    onRecommend({
      recommendation,
      answers: { q1, q2, q3, q4 }
    });
  }, [q1, q2, q3, q4, yearsToSave, onRecommend]); // dependencies đảm bảo chạy khi user chọn

  return (
    <div className="questionnaire-card">
      <p>
        📈 <b>Mutual funds</b> can grow your money but may fluctuate with the market. <br />
        💡 <b>Returns aren’t guaranteed</b> like bank savings. <br />
        📝 <b>Please complete this quick risk survey</b> so we can help you choose based on your <b>financial goals</b> and <b>risk comfort</b>.
      </p>

      {/* Q1 */}
      <label>How long have you been investing (exclude savings deposits)?</label>
      <div className="input-group">
        <FaClock className="icon" />
        <select value={q1} onChange={(e) => setQ1(e.target.value)}>
          <option value="1">Less than 1 year</option>
          <option value="2">1 – 3 years</option>
          <option value="3">4 – 5 years</option>
          <option value="4">More than 5 years</option>
        </select>
      </div>

      {/* Q2 */}
      <label>In case your investment drops over 10%, what would you do?</label>
      <div className="input-group">
        <FaDotCircle className="icon" />
        <select value={q2} onChange={(e) => setQ2(e.target.value)}>
          <option value="1">Sell and hold all cash</option>
          <option value="2">Switch to more conservative fund</option>
          <option value="3">Continue holding</option>
          <option value="4">Continue buying to average down</option>
        </select>
      </div>

      {/* Q3 */}
      <label>Do you agree: “I prefer safe investments even with lower return”</label>
      <div className="input-group">
        <FaChartLine className="icon" />
        <select value={q3} onChange={(e) => setQ3(e.target.value)}>
          <option value="1">Disagree</option>
          <option value="2">Somewhat disagree</option>
          <option value="3">Somewhat agree</option>
          <option value="4">Agree</option>
        </select>
      </div>

      {/* Q4 */}
      <label>Which stock might you choose to invest in?</label>
      <div className="input-group">
        <FaUserTie className="icon" />
        <select value={q4} onChange={(e) => setQ4(e.target.value)}>
          <option value="1">Stable, low-return companies</option>
          <option value="2">Blue chip with dividends</option>
          <option value="3">Established high-growth companies</option>
          <option value="4">Lesser-known high-tech, high-risk</option>
        </select>
      </div>
    </div>
  );
}

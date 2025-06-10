// MutualFundReview.jsx
import React from "react";
import {
  FaClock,
  FaDotCircle,
  FaChartLine,
  FaUserTie
} from "react-icons/fa";
import "./questionnaire.css";

const answerText = {
  q1: {
    1: "Less than 1 year",
    2: "1 – 3 years",
    3: "4 – 5 years",
    4: "More than 5 years"
  },
  q2: {
    1: "Sell and hold all cash",
    2: "Switch to more conservative fund",
    3: "Continue holding",
    4: "Continue buying to average down"
  },
  q3: {
    1: "Disagree",
    2: "Somewhat disagree",
    3: "Somewhat agree",
    4: "Agree"
  },
  q4: {
    1: "Stable, low-return companies",
    2: "Blue chip with dividends",
    3: "Established high-growth companies",
    4: "Lesser-known high-tech, high-risk"
  }
};

const MutualFundReview = ({ answers }) => {
  return (
    <div className="questionnaire-card">
      {/* Q1 */}
      <label>How long have you been investing (exclude savings deposits)?</label>
      <div className="input-group readonly">
        <FaClock className="icon" />
        <div className="readonly-answer">{answerText.q1[answers.q1]}</div>
      </div>

      {/* Q2 */}
      <label>In case your investment drops over 10%, what would you do?</label>
      <div className="input-group readonly">
        <FaDotCircle className="icon" />
        <div className="readonly-answer">{answerText.q2[answers.q2]}</div>
      </div>

      {/* Q3 */}
      <label>Do you agree: “I prefer safe investments even with lower return”</label>
      <div className="input-group readonly">
        <FaChartLine className="icon" />
        <div className="readonly-answer">{answerText.q3[answers.q3]}</div>
      </div>

      {/* Q4 */}
      <label>Which stock might you choose to invest in?</label>
      <div className="input-group readonly">
        <FaUserTie className="icon" />
        <div className="readonly-answer">{answerText.q4[answers.q4]}</div>
      </div>
    </div>
  );
};

export default MutualFundReview;

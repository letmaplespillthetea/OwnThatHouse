// LoanAboutCard.jsx
import React, { useState } from "react";
import "./loan.css";

const data = [
  {
    title: "Why choose this loan?",
    icon: "💰",
    content: "Low interest rates, fast approval, and flexible plans tailored to young professionals."
  },
  {
    title: "Who is this for?",
    icon: "🧍",
    content: "Ideal for young people aged 22–35 with stable income and no prior home loans."
  },
  {
    title: "Flexible collateral accepted",
    icon: "🏠",
    content: "You can use your future house, savings book, or parents’ house as collateral."
  },
  {
    title: "How to apply?",
    icon: "✅",
    content: "Apply online or visit any BIDV branch. Required: ID, income proof, and house info."
  }
];

export default function LoanAboutCard() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
  <div className="loan-about-wrapper">
    <div className="card result-card">
      <h2 className="card-title"><span className="highlight">ABOUT</span></h2>
      <h3 style={{ textAlign: "center", margin: "0", color: "#006C68" }}>
        BIDV HOME LOAN FOR YOUNG PEOPLE
      </h3>
      <p style={{ textAlign: "center", color: "#f59e0b", fontWeight: "bold", marginBottom: "12px" }}>
        Vietnam's largest and most attractive loan package! Just for you!
      </p>

      {data.map((item, index) => (
        <div key={index} className="accordion">
          <div className="accordion-title" style={{color: "#006C68"}} onClick={() => toggle(index)}>
            {item.icon} <strong>{item.title}</strong>
            <span>{openIndex === index ? "−" : "+"}</span>
          </div>
          {openIndex === index && (
            <div className="accordion-content">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

}

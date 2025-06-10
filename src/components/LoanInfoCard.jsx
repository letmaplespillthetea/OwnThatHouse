import React from "react";
import { FaHome, FaCheckSquare } from "react-icons/fa";
import "./loancard.css";

export default function LoanInfoCard() {
  return (
 <div className="inline-info" style={{ marginTop: "1.5rem" }}>
      <h3
        style={{
            fontSize: "1.2rem",
            color: "#00bfff",
            fontWeight: "700",
            marginBottom: "0.5rem",
            textShadow: `
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px  1px 0 #000,
            1px  1px 0 #000
            `
        }}
        >
        ABOUT
        </h3>
      <h4 style={{ fontWeight: "700", color: "#006C68",  textAlign: "center", fontSize: 26 }}>
        BIDV HOME LOAN FOR YOUNG PEOPLE
      </h4>
      <p style={{ color: "#FFC62F", fontWeight: 600, marginBottom: "1rem", textAlign: "center", fontSize: 19 }}>
        Vietnam’s largest and most attractive loan package! <br/> Just for you!
      </p>
      <p style={{color: "#006C68"}}>
        With attractive interest rates and an easy application process,{" "}
        <strong>BIDV Home Loan for Young People</strong> is designed to make home
        ownership more accessible for the younger generation in Vietnam.
      </p>
      <p style={{ color: "#006C68", display: "flex", alignItems: "start", gap: "8px" }}>
        <FaHome style={{ marginTop: "4px" }} />
        For the initial 3 years, interest will be charged at a fixed rate of 5.5% per annum.
      </p>
      <p style={{ color: "#006C68", display: "flex", alignItems: "start", gap: "8px" }}>
        <FaCheckSquare style={{ marginTop: "4px" }} />
        After the 3-year period, the interest rate will be adjusted to the 24-month deposit rate plus 3%.
      </p>
      <p style={{ color: "#006C68"}}>
        You can apply online through{" "}
        <span style={{ color: "#FFC62F", fontWeight: 600 }}>BIDV’s official website</span> or visit the
        nearest <span style={{ color: "#00B2FF", fontWeight: 600 }}>BIDV branch</span> to complete your application.
      </p>
    </div>
  );
}

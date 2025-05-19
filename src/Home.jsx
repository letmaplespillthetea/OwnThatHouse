import React from 'react';
import {
  FaCheckCircle,
  FaHome,
  FaUniversity,
  FaFileAlt
} from 'react-icons/fa';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
  return (
    <div className="home-tab1">
      <h1 className="heading">
        Welcome to <span className="highlight">Finance Quest</span>: Own That House!
      </h1>

      <div className="subheading">We will help you:</div>
      <ul className="benefits">
        <li>
          <FaCheckCircle className="icon" />
          <span>Plan your home ownership journey</span>
        </li>
        <li>
          <FaCheckCircle className="icon" />
          <span>Check how much you can afford</span>
        </li>
        <li>
          <FaCheckCircle className="icon" />
          <span>Discover which loans you qualify for</span>
        </li>
        <li>
          <FaCheckCircle className="icon" />
          <span>Reach your goal faster</span>
        </li>
      </ul>

      <div className="stepper">
        <div className="step active">
          <div className="circle" />
          <FaHome className="step-icon" />
          <span className="step-label">DOWNPAYMENT</span>
        </div>
        <div className="step">
          <div className="circle" />
          <FaUniversity className="step-icon" />
          <span className="step-label">MORTGAGE</span>
        </div>
        <div className="step">
          <div className="circle" />
          <FaFileAlt className="step-icon" />
          <span className="step-label">FINAL PLAN</span>
        </div>
      </div>

      <div className="tip-box">
        TIPS: Determine whether you qualify for the down payment, and formulate your own down payment plan!
      </div>

      <button
      className="start-button"
      onClick={() => navigate('/downpayment')}
      >START YOUR PLAN
      </button>
    </div>
  );
}

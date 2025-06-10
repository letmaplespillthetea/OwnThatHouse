// src/components/StepProgress.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './StepProgress.css'; // we’ll create this next

export default function StepProgress() {
  return (
    <div className="stepper-container">
      <NavLink
        to="/downpayment"
        className={({ isActive }) =>
          isActive ? 'stepper-circle active' : 'stepper-circle'
        }
      >
        {/* the inner dot is styled via CSS; no inner content needed */}
      </NavLink>

      <div className="stepper-line" />

      <NavLink
        to="/saving-plan"
        className={({ isActive }) =>
          isActive ? 'stepper-circle active' : 'stepper-circle'
        }
      >
      </NavLink>

      <div className="stepper-line" />

      <NavLink
        to="/mortgage"
        className={({ isActive }) =>
          isActive ? 'stepper-circle active' : 'stepper-circle'
        }
      >
      </NavLink>
    </div>
  );
}

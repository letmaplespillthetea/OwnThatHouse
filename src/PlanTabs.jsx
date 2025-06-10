// src/PlanTabs.jsx
import React from 'react';
import { usePlans } from './PlanContext';

const PlanTabs = () => {
  const { activePlan, setActivePlan, plans } = usePlans();

  return (
    <div className="tab-container">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          disabled={num > 1 && !plans[num - 1]?.completed}
          className={`tab-btn ${activePlan === num ? 'active' : ''}`}
          onClick={() => setActivePlan(num)}
        >
          {plans[num]?.completed ? '✓ ' : ''}PLAN {num}
        </button>
      ))}
    </div>
  );
};

export default PlanTabs;

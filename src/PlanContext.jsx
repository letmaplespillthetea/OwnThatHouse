// src/PlanContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PlanContext = createContext();
export const usePlans = () => useContext(PlanContext);

export const PlanProvider = ({ children }) => {
  const [activePlan, setActivePlan] = useState(1);
  const [plans, setPlans] = useState({
    1: { completed: false },
    2: { completed: false },
    3: { completed: false },
    4: { completed: false },
    5: { completed: false }
  });

  const updatePlan = (key, value) => {
    setPlans((prev) => ({
      ...prev,
      [activePlan]: {
        ...prev[activePlan],
        [key]: value
      }
    }));
  };

  const markPlanComplete = () => {
    setPlans((prev) => ({
      ...prev,
      [activePlan]: {
        ...prev[activePlan],
        completed: true
      }
    }));
  };

  return (
    <PlanContext.Provider
      value={{ activePlan, setActivePlan, plans, updatePlan, markPlanComplete }}
    >
      {children}
    </PlanContext.Provider>
  );
};

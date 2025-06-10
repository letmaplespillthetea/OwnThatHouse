// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home          from './Home';
import DownPayment   from './Downpayment';
import SavingPlan    from './SavingPlan';
import Mortgage      from './Mortgage';
import FinalPlan     from './FinalPlan';

import { PlanProvider } from './PlanContext';
import StepProgress     from './components/StepProgress'; // ← import the new stepper

export default function App() {
  return (
    <PlanProvider>
      <BrowserRouter>
        <StepProgress />
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/downpayment"  element={<DownPayment />} />
          <Route path="/saving-plan"  element={<SavingPlan />} />
          <Route path="/mortgage"     element={<Mortgage />} />
          <Route path="/final-plan"   element={<FinalPlan />} />
        </Routes>
      </BrowserRouter>
    </PlanProvider>
  );
}

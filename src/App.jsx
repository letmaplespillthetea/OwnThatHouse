import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import DownPayment from './Downpayment';
import Mortgage from './Mortgage'; 
import FinalPlan from './FinalPlan'; 
import SavingPlan from './SavingPlan'; 
import { PlanProvider } from './PlanContext';

export default function App() {
  return (
    <PlanProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/downpayment" element={<DownPayment />} />
          <Route path="/mortgage"    element={<Mortgage />} />
          <Route path="/final-plan"  element={<FinalPlan />} />
          <Route path="/saving-plan" element={<SavingPlan />} />
        </Routes>
      </BrowserRouter>
    </PlanProvider>
  );
}

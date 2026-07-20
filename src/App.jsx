import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LessonsPage from "./components/LessonPage";
import FeaturesPage from "./components/FeaturesPage";
import AlternativesPage from "./components/AlternativePage";
import PricingPage from "./components/PricingPage";
import PaymentPage from "./components/PaymentPage";
import ContactModel from "./components/ContactModel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/lessons" element={<LessonsPage/>} />
        <Route path="/features" element={<FeaturesPage/>} />
        <Route path="/alternatives" element={<AlternativesPage/>} />
        <Route path="/pricing" element={<PricingPage/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/contact" element={<ContactModel/>} />
      </Routes>
    </BrowserRouter>
  );
}
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import LandingSecret from "./pages/LandingSecret";
import JobTitleStep from "./pages/IDP/JobTitleStep";
import FocusStep from "./pages/IDP/FocusStep";
import CompetencyQuestions from "./pages/IDP/CompetencyQuestions"
import Results from "./pages/IDP/Results"
import PL from "./pages/PL";
import PLstudy from "./pages/PLstudy"
import TopNav from "./components/TopNav";

function AppWrapper() {
  const location = useLocation();

  return (
    <>
      {!["/", "/secret"].includes(location.pathname) && <TopNav />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/secret" element={<LandingSecret />} />
        <Route path="/idp" element={<JobTitleStep />} />
        <Route path="/idp/focus" element={<FocusStep />} />
        <Route path="/pl" element={<PL />} />
        <Route path="/plstudy" element={<PLstudy />} />
        <Route path="/idp/questions" element={<CompetencyQuestions />} />
        <Route path="/idp/results" element={<Results />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

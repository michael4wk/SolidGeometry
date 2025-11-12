import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GeometryViewer from "@/pages/GeometryViewer";
import LearningPage from "@/pages/LearningPage";
import ProgressPage from "@/pages/ProgressPage";
import Navigation from "@/components/Navigation";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/geometry/:type" element={<GeometryViewer />} />
            <Route path="/learn/:type" element={<LearningPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LessonsPage from "./components/LessonPage";
import FeaturesPage from "./components/FeaturesPage";
import AlternativesPage from "./components/AlternativePage";
import PricingPage from "./components/PricingPage";
import PaymentPage from "./components/PaymentPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ContactModel from "./components/ContactModel";
import AdminStudents from "./components/Adminstudents";
import AdminCourses from "./components/Admincourses";
import AdminAddStudent from "./components/Adminaddstudent";
import Studentcourses from "./components/Studentcourses";
import StudentLesson from "./components/StudentLesson";

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
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/dashboard" element={<StudentDashboard/>} />
        <Route path="/dashboard/my-courses" element={<Studentcourses/>} />
        {/* <Route path="/dashboard/sessions" element={<StudentSessions />} /> */}
        <Route path="/dashboard/lessons" element={<StudentLesson />} />
        <Route path="/dashboard/*" element={<StudentDashboard/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/admin/*" element={<AdminDashboard/>} />
        <Route path="/contact" element={<ContactModel/>} />
        <Route path="/admin/students" element={<AdminStudents/>} />
        <Route path="/admin/courses" element={<AdminCourses/>} />
        <Route path="/admin/add-student" element={<AdminAddStudent/>} />
      </Routes>
    </BrowserRouter>
  );
}
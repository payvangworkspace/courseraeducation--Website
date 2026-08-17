import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Main Website Pages
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
import CheckoutPage from "./components/CheckoutPage";
import GetPaymentLinkPage from "./components/GetPaymentLinkPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentGatewayForm from "./components/PaymentGatewayForm";
import ReturnRefundPolicyPage from "./components/ReturnRefundPolicyPage";
import CancellationPolicyPage from "./components/CancellationPolicyPage";
import TermsAndConditionsPage from "./components/TermsAndConditionsPage";
import CoursesPage from "./components/CoursesPage";



// PayVang Admin & Aggregator Pages (/home/*)
import DashboardPage from "./pages/DashboardPage";
import SuperAdminDashboardPage from "./pages/SuperAdminDashboardPage";
import MerchantsPage from "./pages/MerchantsPage";
import AddMerchantPage from "./pages/AddMerchantPage";
import AcquirersPage from "./pages/AcquirersPage";
import FeeRulesPage from "./pages/FeeRulesPage";
import AggregatorMappingPage from "./pages/AggregatorMappingPage";
import CryptoConfigPage from "./pages/CryptoConfigPage";
import WalletsPage from "./pages/WalletsPage";
import IPWhitelistPage from "./pages/IPWhitelistPage";
import EmailMasterPage from "./pages/EmailMasterPage";
import MetricsPage from "./pages/MetricsPage";
import TransactionsPage from "./pages/TransactionsPage";
import PaymentsLinksPage from "./pages/PaymentsLinksPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Coursera Education Main Website Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/lessons" element={<LessonsPage />} />

        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/alternatives" element={<AlternativesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<ContactModel />} />

        {/* Student & Classic Admin Views */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard/my-courses" element={<Studentcourses />} />
        <Route path="/dashboard/lessons" element={<StudentLesson />} />
        <Route path="/dashboard/*" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/add-student" element={<AdminAddStudent />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* /checkoutpage/:orderId → loads checkout + calls /checkout/params/:orderId */}
        <Route path="/checkoutpage/:orderId" element={<CheckoutPage />} />
        <Route path="/checkout/:orderId" element={<CheckoutPage />} />
        <Route path="/checkoutpage" element={<GetPaymentLinkPage />} />
        <Route path="/get-payment-link" element={<GetPaymentLinkPage />} />
        <Route path="/payment-gateway-form" element={<PaymentGatewayForm />} />
        <Route path="/home/payment-gateway-form" element={<PaymentGatewayForm />} />
        <Route path="/orderstatus" element={<PaymentSuccess />} />

        {/* Legal & Policy Routes */}
        <Route path="/refund-policy" element={<ReturnRefundPolicyPage />} />
        <Route path="/return-policy" element={<ReturnRefundPolicyPage />} />
        <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
        <Route path="/cancellation" element={<CancellationPolicyPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/terms-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/return-and-refund-policy" element={<ReturnRefundPolicyPage />} />



        {/* PayVang Admin & Payment Aggregator Portal Routes (/home/*) */}
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/home/dashboard" element={<DashboardPage />} />
        <Route path="/home/dashboard/super-admin-dashboard" element={<SuperAdminDashboardPage />} />

        {/* User Management Routes */}
        <Route path="/home/user-management/merchants" element={<MerchantsPage />} />
        <Route path="/home/user-management/merchants/add-merchant" element={<AddMerchantPage />} />
        <Route path="/home/user-management/acquirers" element={<AcquirersPage />} />
        <Route path="/home/user-management/fee-rules" element={<FeeRulesPage />} />
        <Route path="/home/user-management/aggregator-mappings" element={<AggregatorMappingPage />} />
        <Route path="/home/user-management/crypto-config" element={<CryptoConfigPage />} />

        {/* Wallets */}
        <Route path="/home/wallets" element={<WalletsPage />} />

        {/* Payin */}
        <Route path="/home/payin/transactions" element={<TransactionsPage />} />
        <Route path="/home/transactions" element={<TransactionsPage />} />

        {/* Payment Links */}
        <Route path="/home/payments-links" element={<PaymentsLinksPage />} />

        {/* Security & Metrics */}
        <Route path="/home/security/ip-whitelist" element={<IPWhitelistPage />} />
        <Route path="/home/system-metrics" element={<MetricsPage />} />

        {/* Settings & Email */}
        <Route path="/home/settings" element={<SettingsPage />} />
        <Route path="/home/settings/email-master" element={<EmailMasterPage />} />
        <Route path="/home/api-docs" element={<ApiDocsPage />} />

        {/* Fallback Catch-all to LandingPage */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
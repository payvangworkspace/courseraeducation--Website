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

// PayVang Admin & Aggregator Pages (/home/*)
import DashboardPage from "./pages/DashboardPage";
import SuperAdminDashboardPage from "./pages/SuperAdminDashboardPage";
import MerchantsPage from "./pages/MerchantsPage";
import AddMerchantPage from "./pages/AddMerchantPage";
import AcquirersPage from "./pages/AcquirersPage";
import ResellersPage from "./pages/ResellersPage";
import ConfigurationsPage from "./pages/ConfigurationsPage";
import FeeRulesPage from "./pages/FeeRulesPage";
import AggregatorMappingPage from "./pages/AggregatorMappingPage";
import CryptoConfigPage from "./pages/CryptoConfigPage";
import WalletsPage from "./pages/WalletsPage";
import IPWhitelistPage from "./pages/IPWhitelistPage";
import EmailMasterPage from "./pages/EmailMasterPage";
import MetricsPage from "./pages/MetricsPage";
import TeamsPage from "./pages/TeamsPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettlementsPage from "./pages/SettlementsPage";
import RemittancePage from "./pages/RemittancePage";
import ChargebackPage from "./pages/ChargebackPage";
import PaymentsLinksPage from "./pages/PaymentsLinksPage";
import PayoutPage from "./pages/PayoutPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Coursera Education Main Website Routes */}
        <Route path="/" element={<LandingPage />} />
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
        <Route path="/orderstatus" element={<PaymentSuccess />} />

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
        <Route path="/home/user-management/resellers" element={<ResellersPage />} />
        <Route path="/home/user-management/configurations" element={<ConfigurationsPage />} />

        {/* Wallets & Teams Routes */}
        <Route path="/home/wallets" element={<WalletsPage />} />
        <Route path="/home/teams" element={<TeamsPage />} />

        {/* Payin & Settlements Routes */}
        <Route path="/home/payin/transactions" element={<TransactionsPage />} />
        <Route path="/home/transactions" element={<TransactionsPage />} />

        <Route path="/home/payin/settlements" element={<SettlementsPage />} />
        <Route path="/home/settlements/auth-settlement" element={<SettlementsPage />} />

        <Route path="/home/payin/remittance" element={<RemittancePage />} />
        <Route path="/home/remittance" element={<RemittancePage />} />

        <Route path="/home/payin/chargeback" element={<ChargebackPage />} />
        <Route path="/home/charge-back" element={<ChargebackPage />} />

        {/* Payments Links & Payout */}
        <Route path="/home/payments-links" element={<PaymentsLinksPage />} />
        <Route path="/home/payout" element={<PayoutPage />} />

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
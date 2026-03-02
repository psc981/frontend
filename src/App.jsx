import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your Spinner component for loading indication
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Notifications from "./pages/Admin/Notifications";
import Products from "./pages/Products";
import DashboardLayout from "./components/DashboardLayout";
import MyOrders from "./pages/MenuPages/MyOrders";
import Cart from "./pages/MenuPages/Cart";
import WishList from "./pages/MenuPages/WishList";
import Referral from "./pages/MenuPages/Referral";
import StoreKYC from "./pages/MenuPages/StoreKYC";
import Chat from "./pages/MenuPages/Chat";
import Messages from "./pages/MenuPages/Messages";
import Returns from "./pages/MenuPages/Returns";
import Cancellations from "./pages/MenuPages/Cancellations";
import Settings from "./pages/MenuPages/Settings";
import Feedback from "./pages/MenuPages/Feedback";
import Help from "./pages/MenuPages/Help";
import ProductDetails from "./components/Products/ProductDetails";
import KycDetails from "./pages/MenuPages/KycDetails";
import ChatSupport from "./pages/ChatSupport";
import PendingDeposit from "./pages/Admin/PendingDeposit";
import PendingWithdrawal from "./pages/Admin/PendingWithdrawal";
import RechargeHistory from "./pages/Admin/RechargeHistory";
import WithdrawHistory from "./pages/Admin/WithdrawHistory";
import Bonus from "./pages/Admin/Bonus";
import AdminMessages from "./pages/Admin/AdminMessages";
import AdminChat from "./pages/Admin/AdminChat";
import AdminKYC from "./pages/Admin/AdminKYC";
import SocialLinks from "./pages/Admin/SocialLinks";
import ActivityLinks from "./pages/Admin/ActivityLinks";
import Success from "./pages/Success";
import Fail from "./pages/Fail";
import Partners from "./pages/Partners";
import Userdetails from "./pages/Admin/Userdetails";
import ReferralLanding from "./pages/ReferralLanding";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const AdminLogin = lazy(() => import("./pages/Auth/AdminLogin"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Wallet = lazy(() => import("./pages/Wallet"));
const OrderCenter = lazy(() => import("./pages/OrderCenter"));
// const Withdraw = lazy(() => import("./pages/Withdraw"));
const PaymentConfirmation = lazy(() => import("./pages/PaymentConfirmation"));
const About = lazy(() => import("./pages/About"));
const FAQs = lazy(() => import("./pages/FAQs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/Admin/AdminProducts"));
const CreateProduct = lazy(() => import("./pages/Admin/CreateProduct"));
const Users = lazy(() => import("./pages/Admin/Users"));
const Orders = lazy(() => import("./pages/Admin/Orders"));
const AdminManagement = lazy(() => import("./pages/Admin/AdminManagement"));
const SocialLinksComponent = lazy(() => import("./pages/Admin/SocialLinks"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/psc-login"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/psc"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="admin-products" element={<AdminProducts />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<Userdetails />} />{" "}
              {/* <-- Add this */}
              <Route path="activity-links" element={<ActivityLinks />} />
              <Route path="orders" element={<Orders />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="pending-deposit" element={<PendingDeposit />} />
              <Route
                path="pending-withdrawal"
                element={<PendingWithdrawal />}
              />
              <Route path="kyc" element={<AdminKYC />} />
              <Route path="recharge-history" element={<RechargeHistory />} />
              <Route path="withdraw-history" element={<WithdrawHistory />} />
              <Route path="bonus" element={<Bonus />} />
              <Route path="manage-admins" element={<AdminManagement />} />
              <Route path="admin-messages" element={<AdminMessages />} />
              <Route path="support-chat" element={<AdminChat />} />
              <Route path="social-links" element={<SocialLinksComponent />} />
            </Route>

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/partners"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Partners />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/ref/:code" element={<ReferralLanding />} />

            <Route
              path="/products"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Products />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/success"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Success />{" "}
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fail"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Fail />{" "}
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:id"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <ProductDetails />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wallet"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Wallet />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <OrderCenter />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <MyOrders />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Cart />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <WishList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/kyc"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <StoreKYC />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/kyc-details"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <KycDetails />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <ChatSupport />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Messages />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/returns"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Returns />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cancellations"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Cancellations />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/referral"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Referral />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/withdraw"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Withdraw />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/payment-confirmation"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <PaymentConfirmation />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat-support"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <ChatSupport />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <About />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/faqs"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <FAQs />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/feedback"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Feedback />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/help"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <Help />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/privacypolicy"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout>
                    <PrivacyPolicy />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<p>Page Not Found</p>} />
          </Routes>
          {/* ✅ Toast container here */}
          <ToastContainer
            position="top-right"
            autoClose={1200}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
          />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;

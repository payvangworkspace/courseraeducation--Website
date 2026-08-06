import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/dashboard"); // Change route if needed
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const order = {
    id: "ORD-87456291",
    amount: "$249.00",
    method: "Crypto Payment",
    status: "Successful",
    date: new Date().toLocaleString(),
  };

  return (
    <div className="success-page">
      <div className="success-card">

        <div className="success-icon">
          <CheckCircle size={90} strokeWidth={2.2} />
        </div>

        <h1>Payment Successful 🎉</h1>

        <p className="subtitle">
          Thank you! Your payment has been processed successfully.
        </p>

        <div className="details-card">

          <div className="detail-row">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>

          <div className="detail-row">
            <span>Amount</span>
            <strong>{order.amount}</strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <span className="status success">
              {order.status}
            </span>
          </div>

          <div className="detail-row">
            <span>Date</span>
            <strong>{order.date}</strong>
          </div>

        </div>

        <div className="countdown">
          Redirecting to dashboard in <strong>{countdown}</strong>s
        </div>

        <div className="button-group">
          <button
            className="primary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
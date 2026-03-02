import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReferralLanding() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      // ✅ Redirect to signup with referral code in query parameters
      navigate(`/register?ref=${code}`, { replace: true });
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Welcome to Partner Seller Centre!
      </h1>
      <p className="text-gray-700">
        You were referred by someone — getting things ready for you...
      </p>
    </div>
  );
}

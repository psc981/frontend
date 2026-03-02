// src/pages/Help.jsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">
        Last Updated: [Insert Date] | Effective Date: [Insert Date]
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Introduction</h2>
        <p>
          We value your privacy. This policy explains how we collect, use, and
          disclose your information when you use our service.
        </p>

        <h2 className="text-xl font-semibold">Definitions</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Account:</strong> Your unique account created to access our
            service.
          </li>
          <li>
            <strong>Company:</strong> [Insert Company Name], Canada.
          </li>
          <li>
            <strong>Cookies:</strong> Small files placed on your device to track
            browsing history.
          </li>
          <li>
            <strong>Device:</strong> Any device accessing our service (computer,
            mobile, tablet).
          </li>
          <li>
            <strong>Personal Data:</strong> Information relating to an
            identified or identifiable individual.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">
          Collecting and Using Your Personal Data
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Personal Data:</strong> We collect email address, name,
            address, and other information you provide.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect data automatically,
            including IP address, browser type, and device information.
          </li>
          <li>
            <strong>Tracking Technologies:</strong> We use cookies and similar
            technologies to track activity and store information.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">Types of Cookies</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Necessary Cookies: Essential for providing services and features.
          </li>
          <li>
            Cookies Policy/Notice Acceptance Cookies: Identify users who have
            accepted cookie use.
          </li>
          <li>Functionality Cookies: Remember user choices and preferences.</li>
        </ul>

        <h2 className="text-xl font-semibold">Use of Your Personal Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Provide and Maintain Service: Monitor usage and manage accounts.
          </li>
          <li>
            Contact You: Send updates, notifications, and promotional materials.
          </li>
          <li>Manage Requests: Attend to and manage user requests.</li>
          <li>
            Business Transfers: Use data for mergers, acquisitions, or asset
            sales.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">
          Disclosure of Your Personal Data
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Service Providers: Share data with providers to monitor and analyze
            service usage.
          </li>
          <li>
            Business Partners: Share data with partners to offer products or
            services.
          </li>
          <li>
            Law Enforcement: Disclose data when required by law or valid
            requests.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">
          Security of Your Personal Data
        </h2>
        <p>
          We strive to use commercially acceptable means to protect your data.
          However, no method of transmission or storage is 100% secure.
        </p>

        <h2 className="text-xl font-semibold">Children's Privacy</h2>
        <p>
          Our service does not address anyone under 13. We do not knowingly
          collect personally identifiable information from minors.
        </p>

        <h2 className="text-xl font-semibold">
          Changes to this Privacy Policy
        </h2>
        <p>
          We may update this policy from time to time. We'll notify you of
          changes by posting the new policy on this page.
        </p>

        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p>If you have questions or concerns, please contact us.</p>
      </section>
    </div>
  );
}

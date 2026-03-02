// src/pages/FAQs.jsx
import React from "react";

export default function FAQs() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-500 mb-6">
        Find quick answers to common questions about Dropship Store.
      </p>

      {/* About Dropship Store */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About Dropship Store</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>What is Dropship Store?</strong> <br />
            Dropship Store is a multi-vendor e-commerce platform built with
            Laravel API, Nuxt.js frontend, and MySQL database.
          </li>
          <li>
            <strong>Key Features:</strong>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Super-fast performance with advanced caching</li>
              <li>Fully responsive design</li>
              <li>Highly customizable</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* Customization */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Customization</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Admin Panel Customization:</strong>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Regular License: Not customizable</li>
              <li>Extended License: Fully customizable</li>
            </ul>
          </li>
          <li>
            <strong>Frontend and API Customization:</strong>
            <br />
            Easily customizable with provided source code.
          </li>
        </ul>
      </section>

      {/* Support */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Support</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Installation Support:</strong> Yes, installation support is
            provided.
          </li>
          <li>
            <strong>Installation Guide:</strong> Yes, an installation guide is
            included with the packages.
          </li>
          <li>
            <strong>Response Time:</strong> We respond to queries as soon as
            possible.
          </li>
        </ul>
      </section>
    </div>
  );
}

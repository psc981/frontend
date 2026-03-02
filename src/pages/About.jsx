// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        About Partner Seller Centre Shop
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Empowering Dropshipping Success – Learn how we help entrepreneurs grow
        their online businesses.
      </p>

      {/* Intro */}
      <section className="mb-8">
        <p className="text-gray-700 leading-relaxed">
          <strong>Partner Seller Centre Shop</strong> is a revolutionary
          dropshipping platform that enables multiple entrepreneurs to open
          their own online stores and sell products without worrying about
          inventory management, order fulfillment, or shipping logistics. Our
          platform handles all aspects of product sourcing, order processing,
          and shipment to the buyer, allowing our partners to focus on what
          matters most – growing their business and providing excellent customer
          service.
        </p>
      </section>

      {/* Key Features */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-green-500">
          Key Features
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Multi-store support:</strong> Multiple partners can open
            their own stores and sell products through our platform.
          </li>
          <li>
            <strong>Product sourcing:</strong> We handle sourcing, ensuring
            access to a wide range of products.
          </li>
          <li>
            <strong>Order fulfillment:</strong> We process orders and ship
            products to buyers on behalf of our partners.
          </li>
          <li>
            <strong>Timely delivery:</strong> Products are delivered within 24
            to 48 hours, enhancing customer satisfaction and loyalty.
          </li>
        </ul>
      </section>

      {/* Benefits */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-green-500">Benefits</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Low overhead costs:</strong> No need to invest in inventory
            or logistics.
          </li>
          <li>
            <strong>Flexibility:</strong> Focus on marketing and sales while we
            handle backend operations.
          </li>
          <li>
            <strong>Scalability:</strong> Easily grow and expand your business
            with our platform.
          </li>
        </ul>
      </section>

      {/* Join Our Community */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-green-500">
          Join Our Community
        </h2>
        <p className="text-gray-700 leading-relaxed">
          If you're interested in starting your own dropshipping business or
          want to learn more about our platform, we'd love to hear from you!
          Join our community of successful partners and start building your
          online store today.
        </p>
        <p className="mt-4 italic text-green-600 font-semibold">
          “Welcome to Partner Seller Centre Shop, where collaboration meets
          success! Let’s work together to achieve your business goals.”
        </p>
      </section>
    </div>
  );
}

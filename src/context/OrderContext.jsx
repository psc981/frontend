// context/OrderContext.js
import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const placeOrder = (product) => {
    const newOrder = {
      id: Date.now().toString(), // unique id
      product,
      createdAt: new Date(),
      status: "Processing",
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const cancelOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}

import React from "react";
import {
  FiCpu,
  FiBookOpen,
  FiWatch,
  FiZap,
  FiHome,
  FiHeart,
  FiSmile,
  FiPackage,
  FiShoppingBag,
  FiLayers,
} from "react-icons/fi";
import { GiShirt, GiRunningShoe } from "react-icons/gi";

export const CATEGORIES = [
  { name: "Gadgets", icon: <FiPackage /> },
  { name: "Shoes", icon: <GiRunningShoe /> },
  { name: "Shirts", icon: <GiShirt /> },
  { name: "Books", icon: <FiBookOpen /> },
  { name: "Toys", icon: <FiSmile /> },
  { name: "Watches", icon: <FiWatch /> },
  { name: "Electronics", icon: <FiZap /> },
  { name: "Home Decores", icon: <FiHome /> },
  { name: "Women's fashion", icon: <FiShoppingBag /> },
  { name: "Hoodies & shirts", icon: <FiLayers /> },
  { name: "Health & Wellness", icon: <FiHeart /> },
];


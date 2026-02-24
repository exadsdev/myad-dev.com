"use client";

import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    window.location.href = "/api/logout";
  }, []);
  return null;
}

"use client";

import Nav from "./components/nav";
import { useState } from "react";
import Dashboard from "./pages/dashboard";
import Add from "./pages/add";
import Setting from "./pages/setting";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="fixed flex flex-col w-screen h-screen bg-gray-100 overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex items-center justify-center">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "add" && <Add />}
        {activeTab === "setting" && <Setting />}
      </main>
      <Nav setActiveTab={setActiveTab} />
    </div>
  );
}

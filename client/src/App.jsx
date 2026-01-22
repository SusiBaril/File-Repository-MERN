import React from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
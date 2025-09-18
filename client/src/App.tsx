import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import RecipeFinder from './pages/RecipeFinder'
import FoodSharing from './pages/FoodSharing'
import Resources from './pages/Resources'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe_finder" element={<RecipeFinder />} />
          <Route path="/food_sharing" element={<FoodSharing />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

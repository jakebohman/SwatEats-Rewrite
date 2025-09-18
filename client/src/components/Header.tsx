import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const loc = useLocation()
  return (
    <header>
      <a className="skip-link" href="#main">Skip to content</a>
      <nav className="topnav" aria-label="Main navigation">
        <Link className={loc.pathname === '/' ? 'active' : ''} to="/">HOME</Link>
        <Link className={loc.pathname === '/recipe_finder' ? 'active' : ''} to="/recipe_finder">RECIPE FINDER</Link>
        <Link className={loc.pathname === '/food_sharing' ? 'active' : ''} to="/food_sharing">FOOD SHARING</Link>
        <Link className={loc.pathname === '/resources' ? 'active' : ''} to="/resources">RESOURCES</Link>
      </nav>
    </header>
  )
}
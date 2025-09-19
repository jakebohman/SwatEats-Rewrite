import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const loc = useLocation()
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="header-inner">
        <nav className="topnav" aria-label="Main navigation">
          <a className="site-title" href="/" style={{ fontWeight: 700, color: '#9A2A2A' }}>SwatEats</a>
          <Link className={loc.pathname === '/' ? 'active' : ''} to="/">HOME</Link>
          <Link className={loc.pathname === '/recipe_finder' ? 'active' : ''} to="/recipe_finder">FIND RECIPES</Link>
          <Link className={loc.pathname === '/food_sharing' ? 'active' : ''} to="/food_sharing">SHARE FOOD</Link>
          <Link className={loc.pathname === '/resources' ? 'active' : ''} to="/resources">RESOURCES</Link>
        </nav>
      </div>
    </header>
  )
}
import React from 'react'

export default function Resources() {
  return (
    <div>
      <h2 style={{ color: '#9A2A2A' }}>Resources</h2>
      <h1 style={{ color: '#9A2A2A' }}>All resources, one place</h1>
      <p>Curated links to local food pantries, dining center info, and help for students.</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h3>Dining Center Resources</h3>
          <ul>
            <li><a href="https://dash.swarthmore.edu/menu/dining-center">Dining Center Upcoming Menu</a></li>
            <li><a href="https://netnutrition.cbord.com/nn-prod/Swarthmore">Swat NetNutrition</a></li>
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Local Food Banks</h3>
          <ul>
            <li><a href="https://www.sharefoodprogram.org/find-food/">List of Delco Food Pantries</a></li>
            <li><a href="https://www.philabundance.org/">Philabundance</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

export default function Resources() {
  return (
    <div style={{ paddingLeft: 16 }}>
      <h2 style={{ color: '#B86A6A', fontWeight: 300 }}>Resources</h2>
      <h1 style={{ color: '#9A2A2A' }}>All resources, one place</h1>
      <div className="results">
        <p>Curated links to local food pantries, dining center info, and help for students.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#9A2A2A' }}>Dining Center Resources</h3>
            <ul>
              <li><a href="https://dash.swarthmore.edu/menu/dining-center">Dining Center Upcoming Menu</a></li>
              <li><a href="https://netnutrition.cbord.com/nn-prod/Swarthmore">Swat NetNutrition</a></li>
              <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSewG_UgchbjaPfKPKK4ezV1B_ggXawDJ8lqnw_oxes16ViiCA/viewform">Dining Center Feedback Form</a></li>
              <li><a href="https://www.swarthmore.edu/sustainability/zero-waste">Swarthmore Food Recovery Fridge</a></li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#9A2A2A' }}>Local Food Banks</h3>
            <ul>
              <li><a href="https://www.sharefoodprogram.org/find-food/">List of Delco Food Pantries</a></li>
              <li><a href="https://www.lifewerks.org/food-pantry">Lifewerks Food Pantry (Wallingford, PA)</a></li>
              <li><a href="https://www.philabundance.org/">Philabundance (Philadelphia, PA)</a></li>
              <li><a href="https://www.sharefoodprogram.org/">Share Food Program (Philadelphia, PA)</a></li>
            </ul>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#9A2A2A' }}>FLI Food Pantry Resources</h3>
            <ul>
              <li><a href="https://www.instagram.com/swat.flicouncil/">FLI Council Instagram</a></li>
              <li><a href="https://sites.sccs.swarthmore.edu/swatfli/our-initiatives/">FLI Website</a></li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#9A2A2A' }}>Dealing with Food Insecurity</h3>
            <ul>
              <li><a href="https://www.pa.gov/agencies/pda/food/food-assistance/food-security-in-pennsylvania/food-resources-for-pennsylvanians.html">PA State Resources</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

export default function Home() {
  return (
    <div style={{ paddingLeft: 16 }}>
      <h2 style={{ color: '#B86A6A', fontWeight: 300 }}>About</h2>
      <h1 style={{ color: '#9A2A2A' }}>Why did we build SwatEats?</h1>
      <div className="results">
        <p>Hi there! If you're reading this, you're probably like us—a Swarthmore student who's had to navigate the
          reality of limited dining options on campus during breaks.</p>

        <p>Even though Swarthmore College is committed to meeting 100% of students' demonstrated financial needs, food
          insecurity remains a pressing issue—not just during extended winter and summer breaks, but also over shorter
          fall and spring breaks. When dining halls close or operate on reduced schedules, many first-generation,
          low-income (FLI) students, especially those who can't afford to travel home, are left without reliable
          access to food.</p>

        <p>At the same time, a considerable amount of food goes to waste simply because there isn't a system in place to
          redistribute it. Addressing these two issues—food insecurity and food waste—together creates an opportunity
          for a sustainable, community-driven solution. That's where SwatEats comes in.</p>

        <p>We built <b>SwatEats</b> with the goal of making food more accessible to Swarthmore's FLI community by:</p>

        <ol>
          <li><b>Providing personalized recipes based on available ingredients.</b> Have a random assortment of food
            but no idea what to make? Just input what you have, and SwatEats will generate meal ideas to help you
            make the most of your ingredients.</li>

          <li><b>Facilitating peer-to-peer food donations.</b> If you have extra non-perishable food items, you can
            list them on the app for others to claim—reducing waste and ensuring food goes to those who need it. And
            if you're in need of food, you can monitor the page to find missing ingredients or even stock up on
            essentials when resources are tight.</li>

          <li><b>Compiling available resources in one place.</b> SwatEats makes it easier to find and access local
            food pantries, charitable organizations, and other resources that support students facing food
            insecurity.</li>
        </ol>

        <p>At its core, then, <b>SwatEats</b> is about community—about making sure that no one at Swarthmore has to
          choose between focusing on their education and figuring out where to find their next meal. We hope this
          platform helps make campus a little more supportive, a little more resourceful, and a lot more connected.
        </p>

        <p>Thanks for being here!</p>
      </div>
    </div>
  )
}
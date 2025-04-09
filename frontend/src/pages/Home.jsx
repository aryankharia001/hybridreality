import React from 'react'
import Hero from '../components/Hero'
import Companies from '../components/Companies'
import Features from '../components/Features'
import Properties from '../components/propertiesshow'
import Steps from '../components/Steps'
import Testimonials from '../components/testimonial'
import Blog from '../components/Blog'
import FeaturedInvestedProperties from '../components/properties/FeaturedInvestedProperties'

const Home = () => {
  return (
    <div>
      <Hero />
      <Companies />
      <Properties />
      {/* <Features /> */}
      <FeaturedInvestedProperties />
      <Steps />
      {/* <Testimonials /> */}
      {/* <Blog /> */}
    </div>
  )
}

export default Home

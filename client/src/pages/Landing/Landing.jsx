import React from 'react'

import Hero from './Hero'
import FeaturesPage from './FeaturesPage'

function Landing() {

    return (
        <div className='landingpage'>
            <div>
                <Hero />
            </div>
            <div className="section">
                <FeaturesPage />
            </div>

        </div>
    )
}

export default Landing

'use client'

import Snowfall from 'react-snowfall'

export default function SnowOverlay() {
  return (
    <Snowfall
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        pointerEvents: 'none',
      }}
      snowflakeCount={100}
      color="#ffffff"
      radius={[0.5, 3.0]}
      speed={[0.5, 3.0]}
      wind={[-0.5, 2.0]}
    />
  )
}

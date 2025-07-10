import React from 'react'
// max-w-8xl

const Containar = ({children,className}) => {
  return (
    <div className={`max-w-screen-xl mx-auto ${className}`}>{children}</div>
  )
}

export default Containar
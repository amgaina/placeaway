import React from 'react'

export const AbstractLines = ({ className = '' }: { className?: string }) => (
  <svg className={`absolute pointer-events-none ${className}`} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-50 250C50 150 150 150 250 250" stroke="currentColor" strokeWidth="0.5" />
    <path d="M-50 350C150 150 250 150 450 350" stroke="currentColor" strokeWidth="0.5" />
    <path d="M150 0C150 200 250 200 250 400" stroke="currentColor" strokeWidth="0.5" />
    <path d="M250 0C250 200 350 200 350 400" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="350" cy="50" r="20" fill="currentColor" fillOpacity="0.1" />
    <circle cx="50" cy="350" r="30" fill="currentColor" fillOpacity="0.1" />
  </svg>
)

export const AbstractShapes = ({ className = '' }: { className?: string }) => (
  <svg className={`absolute pointer-events-none ${className}`} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="50" width="100" height="100" rx="20" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="300" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" />
    <path d="M100 300L150 250L200 300L250 250L300 300" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="350" cy="350" r="30" fill="currentColor" fillOpacity="0.1" />
    <rect x="50" y="250" width="50" height="50" fill="currentColor" fillOpacity="0.1" />
  </svg>
)


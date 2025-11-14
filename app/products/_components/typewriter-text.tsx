"use client"

import { useEffect, useRef, useState } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  delay = 300,
  className = "",
  onComplete
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayedText("")
    setIsTyping(false)
    
    // Очищаем предыдущий интервал если есть
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current)
    }
    
    const timer = setTimeout(() => {
      setIsTyping(true)
      let currentIndex = 0
      const currentIndexRef = { current: 0 }
      
      typeIntervalRef.current = setInterval(() => {
        if (currentIndexRef.current < text.length) {
          setDisplayedText(text.slice(0, currentIndexRef.current + 1))
          currentIndexRef.current++
        } else {
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current)
            typeIntervalRef.current = null
          }
          setIsTyping(false)
          if (onComplete) {
            onComplete()
          }
        }
      }, speed)
    }, delay)
    
    return () => {
      clearTimeout(timer)
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current)
        typeIntervalRef.current = null
      }
    }
  }, [text, speed, delay])

  return (
    <p className={className}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
      )}
    </p>
  )
}


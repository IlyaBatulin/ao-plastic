"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type LogoItem =
  | {
      node: React.ReactNode
      href?: string
      title?: string
      ariaLabel?: string
    }
  | {
      src: string
      alt?: string
      href?: string
      title?: string
      srcSet?: string
      sizes?: string
      width?: number
      height?: number
    }

export interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  direction?: "left" | "right"
  width?: number | string
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === "number" ? `${value}px` : (value ?? undefined)

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<Element | null>>,
  dependencies: React.DependencyList,
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback()
      window.addEventListener("resize", handleResize)
      callback()
      return () => window.removeEventListener("resize", handleResize)
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null
      const observer = new ResizeObserver(callback)
      observer.observe(ref.current)
      return observer
    })

    callback()

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, dependencies)
}

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: React.DependencyList,
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? []

    if (images.length === 0) {
      onLoad()
      return
    }

    let remainingImages = images.length
    const handleImageLoad = () => {
      remainingImages -= 1
      if (remainingImages === 0) {
        onLoad()
      }
    }

    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement
      if (htmlImg.complete) {
        handleImageLoad()
      } else {
        htmlImg.addEventListener("load", handleImageLoad, { once: true })
        htmlImg.addEventListener("error", handleImageLoad, { once: true })
      }
    })

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad)
        img.removeEventListener("error", handleImageLoad)
      })
    }
  }, dependencies)
}

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean,
) => {
  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Инициализация при первом рендере
    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      track.style.willChange = "transform"
      // Инициализируем скорость для немедленного старта
      velocityRef.current = targetVelocity
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp

      const target = pauseOnHover && isHovered ? 0 : targetVelocity

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * easingFactor

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth
        offsetRef.current = nextOffset

        const translateX = -offsetRef.current
        track.style.transform = `translate3d(${translateX}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    // Всегда запускаем анимацию, даже если seqWidth еще не вычислен
    // Это важно для мобильных устройств, где загрузка может быть медленной
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimestampRef.current = null
    }
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover])
}

export const LogoLoop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 28,
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = "Partner logos",
    className,
    style,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const seqRef = useRef<HTMLUListElement>(null)

    const [seqWidth, setSeqWidth] = useState<number>(0)
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed)
      const directionMultiplier = direction === "left" ? 1 : -1
      const speedMultiplier = speed < 0 ? -1 : 1
      return magnitude * directionMultiplier * speedMultiplier
    }, [speed, direction])

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0
      const list = seqRef.current
      if (!list) return

      // Пробуем несколько способов вычисления ширины для надежности на мобильных
      let sequenceWidth = 0

      // Способ 1: getBoundingClientRect
      const rectWidth = list.getBoundingClientRect()?.width ?? 0
      if (rectWidth > 0) {
        sequenceWidth = rectWidth
      }

      // Способ 2: scrollWidth (более надежно на мобильных)
      if (sequenceWidth === 0 && list.scrollWidth > 0) {
        sequenceWidth = list.scrollWidth
      }

      // Способ 3: offsetWidth
      if (sequenceWidth === 0 && list.offsetWidth > 0) {
        sequenceWidth = list.offsetWidth
      }

      // Способ 4: вычисление через дочерние элементы
      if (sequenceWidth === 0) {
        const items = list.querySelectorAll('.logoloop__item')
        let totalWidth = 0
        items.forEach((item) => {
          const itemRect = (item as HTMLElement).getBoundingClientRect()
          if (itemRect.width > 0) {
            totalWidth += itemRect.width
          } else {
            const itemOffset = (item as HTMLElement).offsetWidth
            if (itemOffset > 0) {
              totalWidth += itemOffset
            }
          }
        })
        // Добавляем gap между элементами
        if (totalWidth > 0 && items.length > 0) {
          totalWidth += (items.length - 1) * gap
          sequenceWidth = totalWidth
        }
      }

      if (sequenceWidth > 0) {
        const calculatedWidth = Math.ceil(sequenceWidth)
        setSeqWidth(calculatedWidth)
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
      }
    }, [gap])

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight])

    useImageLoader(seqRef, () => {
      // Небольшая задержка для мобильных устройств, чтобы убедиться, что размеры вычислены
      setTimeout(() => {
        updateDimensions()
      }, 100)
    }, [logos, gap, logoHeight])

    // Принудительное обновление размеров после монтирования на мобильных
    useEffect(() => {
      // Множественные попытки обновления для надежности на мобильных
      const timers = [
        setTimeout(() => updateDimensions(), 100),
        setTimeout(() => updateDimensions(), 300),
        setTimeout(() => updateDimensions(), 600),
        setTimeout(() => updateDimensions(), 1000),
      ]
      return () => timers.forEach(timer => clearTimeout(timer))
    }, [updateDimensions])

    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover)

    const cssVariables = useMemo(
      () =>
        ({
          "--logoloop-gap": `${gap}px`,
          "--logoloop-logoHeight": `${logoHeight}px`,
          ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
        }) as React.CSSProperties,
      [gap, logoHeight, fadeOutColor],
    )

    const rootClassName = useMemo(
      () =>
        ["logoloop", fadeOut && "logoloop--fade", scaleOnHover && "logoloop--scale-hover", className]
          .filter(Boolean)
          .join(" "),
      [fadeOut, scaleOnHover, className],
    )

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsHovered(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsHovered(false)
  }, [pauseOnHover])

  const handleTouchStart = useCallback(() => {
    if (pauseOnHover) setIsHovered(true)
  }, [pauseOnHover])

  const handleTouchEnd = useCallback(() => {
    if (pauseOnHover) setIsHovered(false)
  }, [pauseOnHover])

    const renderLogoItem = useCallback((item: LogoItem, key: React.Key) => {
      const isNodeItem = "node" in item

      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={item.src || "/placeholder.svg"}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ""}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )

      const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title)

      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || "logo link"}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      )

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      )
    }, [])

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem],
    )

    const containerStyle = useMemo(
      (): React.CSSProperties => ({
        width: toCssLength(width) ?? "100%",
        ...cssVariables,
        ...style,
      }),
      [width, cssVariables, style],
    )

    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="logoloop__track" ref={trackRef}>
          {logoLists}
        </div>
      </div>
    )
  },
)

LogoLoop.displayName = "LogoLoop"

export default LogoLoop

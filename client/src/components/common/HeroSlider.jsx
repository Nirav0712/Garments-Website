import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const HeroSlider = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = slides.filter((s) => s.isActive !== false);

  const nextSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, activeSlides.length]);

  if (!activeSlides || activeSlides.length === 0) {
    return null;
  }

  return (
    <section
      className="hero-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Fashion Hero Carousel"
      style={{ position: 'relative', overflow: 'hidden', height: '80vh', minHeight: '560px', maxHeight: '780px' }}
    >
      {activeSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        const overlayOpacity = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.4;
        const textPos = slide.textPosition || 'left';

        let justifyAlign = 'flex-start';
        let textAlign = 'left';
        if (textPos === 'center') {
          justifyAlign = 'center';
          textAlign = 'center';
        } else if (textPos === 'right') {
          justifyAlign = 'flex-end';
          textAlign = 'right';
        }

        return (
          <div
            key={slide.id || index}
            className={`hero-slide ${isActive ? 'active' : ''}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s ease',
              backgroundImage: `url("${getMediaUrl(slide.image)}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: isActive ? 5 : 1,
            }}
          >
            {/* Minimalist Dark Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: textPos === 'center'
                  ? `radial-gradient(circle at center, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,${Math.min(0.85, overlayOpacity + 0.35)}) 100%)`
                  : textPos === 'right'
                  ? `linear-gradient(270deg, rgba(0, 0, 0, ${Math.max(0.7, overlayOpacity + 0.25)}) 0%, rgba(0, 0, 0, ${overlayOpacity}) 60%, rgba(0, 0, 0, 0.25) 100%)`
                  : `linear-gradient(90deg, rgba(0, 0, 0, ${Math.max(0.7, overlayOpacity + 0.25)}) 0%, rgba(0, 0, 0, ${overlayOpacity}) 60%, rgba(0, 0, 0, 0.25) 100%)`,
              }}
            />

            {/* Slide Content Box */}
            <div className="container-custom" style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: justifyAlign,
              position: 'relative',
              zIndex: 10,
            }}>
              <div style={{ maxWidth: '680px', color: '#FFFFFF', textAlign }}>
                {/* Subtitle / Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1.25rem',
                  justifyContent: textPos === 'center' ? 'center' : (textPos === 'right' ? 'flex-end' : 'flex-start'),
                }}>
                  {slide.badge && (
                    <span style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-button-text)',
                      padding: '5px 12px',
                      borderRadius: 'var(--button-radius)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}>
                      {slide.badge}
                    </span>
                  )}
                  {slide.subtitle && (
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#E5E7EB',
                    }}>
                      {slide.subtitle}
                    </span>
                  )}
                </div>

                {/* Main Fashion Headline */}
                <h1 style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: '#FFFFFF',
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                }}>
                  {slide.title}
                </h1>

                {/* Narrative Description */}
                {slide.description && (
                  <p style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                    lineHeight: 1.6,
                    color: '#E2E8F0',
                    marginBottom: '2.25rem',
                    fontWeight: 400,
                    maxWidth: textPos === 'center' ? '580px' : '520px',
                    margin: textPos === 'center' ? '0 auto 2.25rem auto' : (textPos === 'right' ? '0 0 2.25rem auto' : '0 0 2.25rem 0'),
                  }}>
                    {slide.description}
                  </p>
                )}

                {/* Action CTA Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '14px',
                  flexWrap: 'wrap',
                  justifyContent: textPos === 'center' ? 'center' : (textPos === 'right' ? 'flex-end' : 'flex-start'),
                }}>
                  {slide.buttonText && (
                    <Link
                      to={slide.buttonUrl || '/products'}
                      className="btn btn-lg"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        border: '1px solid #FFFFFF',
                        fontWeight: 800,
                        padding: '0.85rem 2rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontSize: '0.85rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}

                  <Link
                    to="/products"
                    className="btn btn-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      backdropFilter: 'blur(8px)',
                      fontWeight: 700,
                      padding: '0.85rem 1.75rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      fontSize: '0.85rem',
                    }}
                  >
                    View Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Minimalist Progress Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === currentIndex ? '36px' : '8px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;

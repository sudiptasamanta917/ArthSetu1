import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Shield, 
  Zap, 
  Percent, 
  Award, 
  Coins, 
  Building2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { HeroSlideData } from '../../types';

interface HeroCarouselProps {
  onSelectAction: (action: 'personal_loan' | 'cibil_check' | 'fixed_deposit' | 'investments') => void;
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 1,
    badge: 'Pre-Approved Offer',
    badgeColor: 'bg-teal-800/80 text-teal-100 border-teal-700',
    title: 'Instant Personal Loan up to',
    highlightText: '₹10,00,000',
    description: 'Get money directly in your bank account in 2 minutes. 100% digital, zero collateral, and customized flexible EMIs.',
    ctaText: 'Apply Personal Loan',
    ctaAction: 'personal_loan',
    gradientBg: 'from-teal-900 via-teal-950 to-slate-900',
    accentBorder: 'border-teal-800',
    metrics: [
      { label: 'Interest Rate', value: 'From 1.33% p.m.', sublabel: 'Annual 14%' },
      { label: 'Disbursal Speed', value: '2 Minutes', sublabel: 'Direct to Bank' },
      { label: 'Loan Tenure', value: '3 - 60 Months', sublabel: 'Flexible EMIs' },
    ],
    tag: 'Instant Cash in 2 Mins',
    iconName: 'Zap',
  },
  {
    id: 2,
    badge: 'Free Credit Health',
    badgeColor: 'bg-slate-800 text-teal-200 border-slate-700',
    title: 'Check Your CIBIL Score with',
    highlightText: 'Detailed Report (785+)',
    description: 'Track your official credit health monthly. Zero impact on your credit score, with personalized tips to boost approval odds.',
    ctaText: 'Check Free CIBIL Score',
    ctaAction: 'cibil_check',
    gradientBg: 'from-slate-900 via-slate-950 to-teal-950',
    accentBorder: 'border-slate-800',
    metrics: [
      { label: 'CIBIL Bureau', value: 'Official TransUnion', sublabel: 'Verified Partner' },
      { label: 'Soft Check', value: '0 Score Impact', sublabel: 'Safe to check' },
      { label: 'Monthly Refresh', value: 'Free Forever', sublabel: 'Zero hidden fees' },
    ],
    tag: 'Official TransUnion CIBIL',
    iconName: 'Award',
  },
  {
    id: 3,
    badge: 'Guaranteed Returns',
    badgeColor: 'bg-teal-900/90 text-amber-200 border-teal-700',
    title: 'High-Yield Fixed Deposits up to',
    highlightText: '9.15% p.a.',
    description: 'Lock in industry-leading fixed deposit rates from RBI Regulated Banks and CRISIL AAA Rated NBFCs with flexible interest payouts.',
    ctaText: 'Compare & Book FD',
    ctaAction: 'fixed_deposit',
    gradientBg: 'from-teal-950 via-slate-900 to-slate-950',
    accentBorder: 'border-teal-900',
    metrics: [
      { label: 'Senior Citizen', value: 'Up to 9.15% p.a.', sublabel: '+0.50% extra' },
      { label: 'Safety Rating', value: 'CRISIL AAA', sublabel: 'DICGC Insured' },
      { label: 'Min Investment', value: '₹1,000 Only', sublabel: 'Paperless e-KYC' },
    ],
    tag: 'DICGC & AAA Insured',
    iconName: 'Building2',
  },
  {
    id: 4,
    badge: 'Wealth & Savings',
    badgeColor: 'bg-slate-800 text-teal-200 border-slate-700',
    title: 'Direct Mutual Funds & 24K',
    highlightText: 'Digital Gold (₹100 SIP)',
    description: 'Grow wealth with zero commission direct mutual funds and 99.9% 24K pure digital gold stored in secure bank-grade vaults.',
    ctaText: 'Start SIP / Buy Gold',
    ctaAction: 'investments',
    gradientBg: 'from-slate-900 via-teal-950 to-slate-950',
    accentBorder: 'border-slate-800',
    metrics: [
      { label: 'Start SIP with', value: '₹100 / Month', sublabel: 'Auto-debit setup' },
      { label: 'Commission', value: '0% Direct Plans', sublabel: 'Save up to 1.5%' },
      { label: 'Digital Gold', value: '24K 99.9% Pure', sublabel: 'MMTC-PAMP Vaults' },
    ],
    tag: 'Zero Commission Investing',
    iconName: 'Coins',
  },
];

const AUTOPLAY_INTERVAL = 5500; // 5.5 seconds per slide

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = right, -1 = left
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth auto-play slider
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    // Reset progress
    setProgress(0);
    const stepTime = 50; // update progress bar every 50ms
    const totalSteps = AUTOPLAY_INTERVAL / stepTime;
    let stepCount = 0;

    progressIntervalRef.current = setInterval(() => {
      stepCount++;
      setProgress((stepCount / totalSteps) * 100);
    }, stepTime);

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      setProgress(0);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  // Motion variants for smooth horizontal carousel sliding
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <section 
      className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Money View Highlights Carousel"
    >
      {/* 4 Multi-tab top navigation headers for seamless jumping */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50/90 border-b border-slate-200/90">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => handleDotClick(idx)}
              className={`relative px-3 py-2.5 sm:px-4 sm:py-3 text-left transition flex flex-col justify-between cursor-pointer ${
                isActive 
                  ? 'bg-white text-slate-900' 
                  : 'hover:bg-slate-100/70 text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-700 ring-2 ring-teal-700/20' : 'bg-slate-400'}`} />
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  0{idx + 1}. {slide.tag}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700 truncate hidden sm:block">
                {slide.highlightText}
              </span>

              {/* Active Slide Progress Bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-teal-700 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Carousel Stage */}
      <div className="relative min-h-[340px] sm:min-h-[310px] p-5 sm:p-7 flex items-center overflow-hidden bg-slate-50/40">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`w-full bg-gradient-to-br ${currentSlide.gradientBg} text-white rounded-2xl p-5 sm:p-7 border ${currentSlide.accentBorder} shadow-md backdrop-blur-md`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Content info */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${currentSlide.badgeColor} flex items-center gap-1 shadow-xs`}>
                    <Sparkles className="w-3 h-3 text-teal-300" />
                    {currentSlide.badge}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Live Dashboard Summary
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg md:text-xl font-medium text-slate-200">
                    {currentSlide.title}
                  </h2>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    {currentSlide.highlightText}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {currentSlide.description}
                </p>

                {/* Primary CTA Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectAction(currentSlide.ctaAction)}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white hover:bg-slate-100 text-teal-950 font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 group cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-teal-900 transition-transform group-hover:translate-x-1" />
                  </button>

                  <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                    Instant Decision • Zero Impact
                  </span>
                </div>
              </div>

              {/* Right Content / Financial Metric Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                {currentSlide.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between hover:bg-white/15 transition shadow-2xs"
                  >
                    <div>
                      <p className="text-[11px] font-medium text-slate-300">{metric.label}</p>
                      <p className="text-base font-extrabold text-white">{metric.value}</p>
                    </div>
                    {metric.sublabel && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/15 text-teal-200 border border-white/20">
                        {metric.sublabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center backdrop-blur-md transition cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center backdrop-blur-md transition cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom status strip */}
      <div className="px-6 py-2.5 bg-slate-50/90 border-t border-slate-200/90 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-700 animate-pulse" />
          <span className="text-[11px] font-medium">Slide {currentIndex + 1} of {HERO_SLIDES.length} (Cycles every 5.5s)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {HERO_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => handleDotClick(dotIdx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                dotIdx === currentIndex ? 'w-6 bg-teal-800' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Jump to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

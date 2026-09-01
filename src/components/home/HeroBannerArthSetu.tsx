import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface HeroBannerArthSetuProps {
  onApplyPersonalLoan: () => void;
  onApplyBusinessLoan: () => void;
  onApplyFd: () => void;
}

export const HeroBannerArthSetu: React.FC<HeroBannerArthSetuProps> = ({
  onApplyPersonalLoan,
  onApplyBusinessLoan,
  onApplyFd,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    {
      id: 'personal_loan',
      tagline: 'Funds for every need',
      title: 'Personal Loan',
      uptoLabel: 'up to',
      highlightAmount: '₹20 Lakhs*',
      features: 'Low Interest Rates\nStarting at 8.4% p.a.*',
      buttonText: 'Apply for Personal Loan',
      buttonAction: onApplyPersonalLoan,
      badgePercent: '%',
      badgeRupee: '₹',
      imageSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'business_loan',
      tagline: 'Empower your enterprise',
      title: 'Business Loan',
      uptoLabel: 'up to',
      highlightAmount: '₹75 Lakhs*',
      features: 'Collateral-Free Capital\nStarting at 11.2% p.a.*',
      buttonText: 'Apply for Business Loan',
      buttonAction: onApplyBusinessLoan,
      badgePercent: 'GST',
      badgeRupee: '₹',
      imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'fixed_deposit',
      tagline: 'Guaranteed high returns',
      title: 'Fixed Deposit',
      uptoLabel: 'up to',
      highlightAmount: '8.30% p.a.*',
      features: 'DICGC Insured up to ₹5L\nZero Risk Guaranteed',
      buttonText: 'Explore Fixed Deposits',
      buttonAction: onApplyFd,
      badgePercent: 'AAA',
      badgeRupee: '₹',
      imageSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  // Auto-cycle banner slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const slide = SLIDES[currentSlide];

  return (
    <div className="space-y-3">
      {/* Main Banner Card matching Screenshot 1 */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-[#C6E6EC] bg-gradient-to-br from-[#D2F0F6] via-[#E4F7FA] to-[#C7EBF2]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 sm:p-5 flex items-center justify-between min-h-[220px] relative overflow-hidden"
          >
            {/* Left Content Area matching Screenshot 1 */}
            <div className="w-[58%] z-10 space-y-1.5 pr-1">
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 tracking-tight">
                {slide.tagline}
              </p>

              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#003844] leading-none tracking-tight">
                  {slide.title}
                </h2>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[11px] sm:text-xs font-medium text-slate-700">
                    {slide.uptoLabel}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#003844] tracking-tight">
                    {slide.highlightAmount}
                  </span>
                </div>
              </div>

              <div className="pt-0.5 pb-1">
                <p className="text-[10px] sm:text-[11px] text-slate-700 font-medium whitespace-pre-line leading-tight">
                  {slide.features}
                </p>
              </div>

              <div className="pt-1">
                <button
                  onClick={slide.buttonAction}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#004856] hover:bg-[#003844] text-white font-bold text-[11px] sm:text-xs shadow-xs transition-all flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <p className="text-[8px] sm:text-[9px] text-slate-500 pt-0.5 font-medium">
                *T&C Apply
              </p>
            </div>

            {/* Right Visual Area matching Screenshot 1 (Person with phone, thumbs up & badges) */}
            <div className="w-[42%] relative flex items-center justify-center min-h-[190px]">
              {/* Dotted Grid on Background */}
              <div 
                className="absolute top-2 right-2 w-20 h-20 opacity-30 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(#004856 1.5px, transparent 1.5px)',
                  backgroundSize: '8px 8px'
                }}
              />

              {/* Light Cyan Circular Halo behind user */}
              <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-white/60 bg-gradient-to-tr from-[#BEE9F1] to-white/80 shadow-inner" />

              {/* Floating Top-Right Rupee Badge */}
              <motion.div 
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="absolute top-3 right-2 w-7 h-7 rounded-full bg-white shadow-md border border-[#CCEBF2] flex items-center justify-center text-[#004856] font-extrabold text-xs z-20"
              >
                {slide.badgeRupee}
              </motion.div>

              {/* Floating Mid-Left Percentage Badge */}
              <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="absolute top-1/3 -left-1 w-6 h-6 rounded-full bg-[#D7F7E8] shadow-md border border-[#A7EAD0] flex items-center justify-center text-[#047857] font-black text-[10px] z-20"
              >
                {slide.badgePercent}
              </motion.div>

              {/* Center Portrait with Thumbs Up & Phone Look */}
              <div className="relative w-32 h-36 sm:w-36 sm:h-40 flex items-end justify-center z-10">
                <img
                  src={slide.imageSrc}
                  alt="ArthSetu Customer"
                  className="w-28 h-34 sm:w-32 sm:h-38 object-cover rounded-2xl shadow-md border-2 border-white"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Bottom-Right Bag Badge */}
              <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-white shadow-md border border-[#CCEBF2] flex items-center justify-center text-[#004856] z-20">
                <ShoppingBag className="w-4 h-4 text-[#004856]" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicator Dots below the banner matching Screenshot 1 */}
      <div className="flex items-center justify-center gap-1.5 py-0.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 cursor-pointer ${
              idx === currentSlide
                ? 'w-6 h-1.5 bg-[#00829B] rounded-full'
                : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

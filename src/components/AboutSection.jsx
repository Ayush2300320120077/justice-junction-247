import Link from 'next/link'
import { ShieldCheck, Scale, Award, Users, CheckCircle, ArrowRight } from 'lucide-react'

/* 
 * PLACEHOLDER STATS DATA:
 * These figures are initial placeholder benchmarks.
 * Swap these values with live database counts or production metrics as needed.
 */
const STATS = [
  {
    /* PLACEHOLDER STAT 1 */
    number: '500+',
    label: 'Verified Lawyers',
    subtext: 'Across India'
  },
  {
    /* PLACEHOLDER STAT 2 */
    number: '10,000+',
    label: 'Consultations',
    subtext: 'Successfully Completed'
  },
  {
    /* PLACEHOLDER STAT 3 */
    number: '28',
    label: 'States Covered',
    subtext: 'Pan-India Reach'
  },
  {
    /* PLACEHOLDER STAT 4 */
    number: '100%',
    label: 'Transparent Pricing',
    subtext: 'Zero Hidden Fees'
  }
]

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FDF6EE] relative overflow-hidden border-b border-[#E8C9A8]/40">
      {/* Background decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7B1D2E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E8C9A8]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story & Mission Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* 1. Small Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B1D2E]/10 border border-[#7B1D2E]/20 text-[#7B1D2E] text-xs font-extrabold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-[#7B1D2E] animate-pulse" />
              ABOUT JUSTICEJUNCTION
            </div>

            {/* 2. Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A0A0D] tracking-tight leading-tight mb-6 font-serif">
              India's Most Trusted{' '}
              <span className="text-[#7B1D2E] italic font-serif">
                Legal Marketplace
              </span>
            </h2>

            {/* 3. Body Copy (2-3 sentences explaining mission) */}
            <p className="text-base sm:text-lg text-[#5A3A42] leading-relaxed mb-4 font-sans">
              JusticeJunction bridges the gap between citizens and justice by connecting clients directly with Bar Council verified advocates across India. Built to remove friction, ambiguity, and hidden costs from finding legal help, we empower every individual with transparent upfront pricing and 24/7 accessibility.
            </p>

            <p className="text-sm sm:text-base text-[#5A3A42]/90 leading-relaxed mb-8 font-sans">
              Whether you require emergency legal assistance or routine consultation, our secure digital platform ensures confidential, reliable, and seamless access to top legal minds whenever you need them.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
              <div className="flex items-center gap-2.5 text-[#1A0A0D] font-medium text-sm sm:text-base">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7B1D2E] text-white flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span>Bar Council Verified Lawyers</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1A0A0D] font-medium text-sm sm:text-base">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7B1D2E] text-white flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span>100% Upfront Fixed Pricing</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1A0A0D] font-medium text-sm sm:text-base">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7B1D2E] text-white flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span>24/7 Consultation Booking</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1A0A0D] font-medium text-sm sm:text-base">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7B1D2E] text-white flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span>Encrypted Video Consultations</span>
              </div>
            </div>

            {/* 5. Secondary CTA Button */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#7B1D2E] hover:bg-[#5C1521] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <span>Learn More About Us</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Stat Showcase */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Card */}
              <div className="bg-gradient-to-br from-[#7B1D2E] to-[#5C1521] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-[#E8C9A8]/20">
                
                {/* Decorative background grid pattern */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.4) 2px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }}
                />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/15 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <Scale className="text-[#F5C4B3] w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                        JusticeJunction Impact
                      </h3>
                      <p className="text-xs text-[#F5C4B3] font-medium tracking-wide uppercase">
                        Legal Excellence & Trust
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F5C4B3]/20 border border-[#F5C4B3]/40 text-[#F5C4B3] text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                    VERIFIED
                  </span>
                </div>

                {/* 4. Stat Highlights Grid (2x2) */}
                {/* PLACEHOLDER NUMBERS: Marked clearly as PLACEHOLDER */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5 relative z-10">
                  {STATS.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 hover:bg-white/15 transition-all"
                    >
                      {/* PLACEHOLDER NUMBER */}
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F5C4B3] font-sans tracking-tight mb-1">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {stat.label}
                      </div>
                      <div className="text-[11px] text-[#F9EEE4]/70 mt-0.5 font-sans">
                        {stat.subtext}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Badge */}
                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-[#F9EEE4]/80 relative z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#F5C4B3]" />
                    <span>Bar Council Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#F5C4B3] font-semibold">
                    <Award size={14} />
                    <span>24/7 Platform</span>
                  </div>
                </div>

              </div>

              {/* Floating Highlight Badge */}
              <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-4 bg-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-[#E8C9A8] flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-[#7B1D2E]/10 flex items-center justify-center text-[#7B1D2E]">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#1A0A0D]">
                    Pan-India Network
                  </div>
                  <div className="text-[11px] text-[#5A3A42]">
                    Advocates in 100+ cities
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

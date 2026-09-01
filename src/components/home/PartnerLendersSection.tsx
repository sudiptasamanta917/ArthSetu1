import React from 'react';
import { ShieldCheck, Lock, Award, Building2 } from 'lucide-react';

export const PartnerLendersSection: React.FC = () => {
  const PARTNERS = [
    { name: 'DMI Finance', type: 'RBI Regulated NBFC', rating: 'AAA Rated' },
    { name: 'Northern Arc', type: 'Diversified NBFC', rating: 'CRISIL AA+' },
    { name: 'IDFC FIRST Bank', type: 'Scheduled Commercial Bank', rating: 'Top Tier' },
    { name: 'Aditya Birla Capital', type: 'Leading NBFC', rating: 'AAA Rated' },
    { name: 'Fullerton India', type: 'SMFG NBFC', rating: 'AAA Rated' },
    { name: 'Shriram Finance', type: 'Largest Retail NBFC', rating: 'CRISIL AAA' },
  ];

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8F7F9] border border-cyan-100 flex items-center justify-center text-[#004856]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">RBI Registered Lending & Banking Partners</h3>
            <p className="text-xs text-slate-500">100% compliant with Reserve Bank of India digital lending guidelines</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#004856] font-semibold bg-[#E8F7F9] px-2.5 py-1 rounded-full border border-cyan-200 self-start sm:self-auto">
          <Lock className="w-3 h-3 text-[#004856]" />
          <span>256-Bit SSL Bank Encryption</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {PARTNERS.map((partner, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-center items-center text-center hover:border-slate-300 transition"
          >
            <Building2 className="w-5 h-5 text-slate-500 mb-1.5" />
            <p className="text-xs font-bold text-slate-900 truncate w-full">{partner.name}</p>
            <span className="text-[10px] text-slate-500 truncate w-full">{partner.type}</span>
            <span className="text-[9px] font-semibold text-[#004856] mt-1 bg-[#E8F7F9] px-1.5 py-0.5 rounded border border-cyan-200">
              {partner.rating}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

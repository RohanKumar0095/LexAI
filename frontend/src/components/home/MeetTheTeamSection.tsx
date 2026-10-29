import React from 'react';
import { Card } from '../ui/Card';
import { teamMembers } from '../../data/team';

const LinkedInIcon = () => (
  <svg className="w-4 h-4 shrink-0 text-[#C084FC]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const MeetTheTeamSection: React.FC = () => {
  return (
    <section id="meet-the-team" className="py-24 relative bg-[#0D0918]/95 border-t border-[#C084FC]/15">
      {/* Background ambient lighting subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-[#A855F7]/07 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header — Loopy SaaS Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="caption-text text-[#C084FC] inline-block font-semibold tracking-wider">
            Contributors & Creators
          </span>
          <h2 className="heading-xl text-white font-display">
            The People Behind <span className="lexai-signature-gradient">LexAI-India</span>
          </h2>
          <p className="body-md text-[#AAA1BC] leading-relaxed max-w-2xl mx-auto">
            LexAI-India is a collaborative project dedicated to making legal knowledge accessible to all citizens through technology, research, and design.
          </p>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card 
              key={member.linkedinUrl}
              variant="elevated" 
              className="flex flex-col items-center justify-between p-8 text-center border border-[#C084FC]/15 bg-[#151020] transition-all duration-300 hover:-translate-y-1 hover:border-[#A855F7]/50 hover:bg-[#1C1530] hover:shadow-xl hover:shadow-purple-950/20 group h-full rounded-2xl shadow-lg shadow-black/50"
            >
              <div className="space-y-6 flex flex-col items-center w-full">
                {/* Initials-Based Avatar with Luminous Purple Accent */}
                <div 
                  className="w-20 h-20 rounded-2xl bg-[#1C1530] border border-[#C084FC]/30 flex items-center justify-center text-[#C084FC] text-2xl font-bold font-display select-none transition-all duration-300 group-hover:border-[#C084FC]/60 group-hover:scale-105 shadow-md shadow-purple-950/40"
                  aria-hidden="true"
                >
                  {member.initials}
                </div>

                {/* Team Info */}
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#C084FC] transition-colors duration-200">
                    {member.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#AAA1BC]">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* LinkedIn Button CTA */}
              <div className="w-full pt-8">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl border border-[#C084FC]/20 hover:border-[#A855F7]/50 bg-[#100918] hover:bg-[#1C1530] text-xs font-semibold text-[#FAF8FF] transition-all duration-300 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 hover:scale-[1.02]"
                  aria-label={`View ${member.name}'s LinkedIn profile`}
                >
                  <LinkedInIcon />
                  <span>View LinkedIn Profile</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
export default MeetTheTeamSection;
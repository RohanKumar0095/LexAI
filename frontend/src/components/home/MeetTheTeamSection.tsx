import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { teamMembers } from '../../data/team';

const LinkedInIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const MeetTheTeamSection: React.FC = () => {
  return (
    <section id="meet-the-team" className="py-24 relative bg-midnight-base border-t border-midnight-border">
      {/* Background ambient lighting subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-electric-glow/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="electric">Contributors</Badge>
          <h2 className="heading-xl text-white font-display">
            The People Behind <span className="text-saffron">LexAI-India</span>
          </h2>
          <p className="body-md text-text-secondary leading-relaxed">
            LexAI-India is a collaborative project focused on making legal awareness more accessible through technology. The project brings together contributors working across ideas, product development, research, design, and technology.
          </p>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card 
              key={member.linkedinUrl}
              variant="elevated" 
              className="flex flex-col items-center justify-between p-8 text-center border border-midnight-border bg-midnight-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-saffron/40 hover:bg-[#20232A]/30 shadow-md group h-full"
            >
              <div className="space-y-6 flex flex-col items-center w-full">
                {/* Tasteful Initials-Based Avatar Placeholder */}
                <div 
                  className="w-20 h-20 rounded-full bg-[#1E2A45] border border-saffron/20 flex items-center justify-center text-saffron text-xl font-bold font-display select-none transition-colors duration-300 group-hover:border-saffron/40"
                  aria-hidden="true"
                >
                  {member.initials}
                </div>

                {/* Team Info */}
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-saffron transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider font-semibold text-text-muted">
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
                  className="inline-flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl border border-midnight-border hover:border-saffron/40 bg-midnight-base hover:bg-saffron/5 text-xs font-semibold text-text-secondary hover:text-white transition-all duration-300 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-saffron/30"
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

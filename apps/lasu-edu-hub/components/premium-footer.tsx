'use client';

export function PremiumFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="border-t-4 border-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-accent">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/" className="hover:text-accent transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/academics" className="hover:text-accent transition-colors">
                    Academics
                  </a>
                </li>
                <li>
                  <a href="/resources" className="hover:text-accent transition-colors">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="/news" className="hover:text-accent transition-colors">
                    News
                  </a>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-accent">Information</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://lasu.edu.ng" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    LASU Main Site
                  </a>
                </li>
                <li>
                  <a href="https://lasu.edu.ng/academics" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    LASU Academics
                  </a>
                </li>
                <li>
                  <a href="https://lasu.edu.ng/admissions" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    Admissions
                  </a>
                </li>
                <li>
                  <a href="https://lasu.edu.ng/research" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    Research
                  </a>
                </li>
              </ul>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-accent">About</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://lasu.edu.ng/about" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    About LASU
                  </a>
                </li>
                <li>
                  <a href="https://lasu.edu.ng/contact" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="https://lasu.edu.ng/faculty-of-education" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    Faculty of Education
                  </a>
                </li>
                <li>
                  <a href="https://lasu.edu.ng/departments" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    All Departments
                  </a>
                </li>
              </ul>
            </div>

            {/* Department Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-accent">Department</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/90">
                Department of Science and Technology Education
              </p>
              <p className="text-sm text-primary-foreground/75">
                Faculty of Education, Lagos State University, Ojo Campus
              </p>
              <p className="text-xs text-primary-foreground/60 pt-2">
                For Truth and Service
              </p>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-primary-foreground/80">
                © {new Date().getFullYear()} LASU STE Hub. All rights reserved.
              </p>
              <p className="text-sm text-primary-foreground/70">
                Made with care for LASUites by{' '}
                <a href="mailto:onimisiadeolu@gmail.com" className="text-accent hover:underline">
                  reabot6
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="bg-accent/20 text-center py-4 border-t border-accent/30">
        <p className="text-sm font-semibold text-accent">
          WE ARE LASU • WE ARE GREAT • FOR TRUTH AND SERVICE
        </p>
      </div>
    </footer>
  );
}

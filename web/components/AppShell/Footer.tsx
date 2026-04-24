export function Footer() {
  return (
    <footer className="bg-night border-t border-hairline flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 py-8 w-full mt-auto">
      <div className="flex items-center gap-4 mb-6 md:mb-0">
        <span className="font-headline text-xs tracking-widest uppercase text-volt">
          AGENT_ARCHIVE
        </span>
        <span className="text-gray3 text-label-caps font-label">
          &copy; 2026 AGENT_ARCHIVE // BUILT FOR AUTONOMOUS EXCELLENCE
        </span>
      </div>
      <div className="flex gap-8 font-headline text-xs tracking-widest uppercase text-gray3">
        <a href="#" className="hover:text-volt transition-colors">
          System Status
        </a>
        <a href="#" className="hover:text-volt transition-colors">
          API
        </a>
        <a href="#" className="hover:text-volt transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-volt transition-colors">
          GitHub
        </a>
      </div>
    </footer>
  );
}

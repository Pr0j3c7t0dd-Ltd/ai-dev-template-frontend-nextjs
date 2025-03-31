export function scrollToSection(href: string): void {
  // Handle hash links (internal page navigation)
  if (href.startsWith('/#')) {
    const sectionId = href.substring(2);
    scrollToElementById(sectionId);
  } else if (href === '/') {
    // For the home link, scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

// Helper function to scroll to an element by ID
function scrollToElementById(id: string): void {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

// Set up intersection observers to detect which section is currently visible
export function setupSectionObservers(onSectionChange: (sectionId: string) => void): () => void {
  const sections = ['hero', 'features', 'pricing', 'contact'];
  const observers: IntersectionObserver[] = [];

  // Options for the intersection observer
  const options = {
    root: null, // viewport as root
    rootMargin: '-100px 0px -100px 0px', // margin around the root
    threshold: 0.2, // trigger when 20% of the target is visible
  };

  // Create observers for each section
  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onSectionChange(sectionId);
        }
      });
    }, options);

    observer.observe(element);
    observers.push(observer);
  });

  // Return a cleanup function
  return () => {
    observers.forEach(observer => observer.disconnect());
  };
}

// Handle hash navigation after page load
export function handleInitialScroll(): void {
  // Check if URL has a hash fragment
  if (typeof window !== 'undefined' && window.location.hash) {
    // Remove the # character
    const sectionId = window.location.hash.substring(1);

    // Wait for the page to fully load before scrolling
    setTimeout(() => {
      scrollToElementById(sectionId);
    }, 100);
  }
}

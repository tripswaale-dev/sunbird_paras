'use client';

export function NewsletterForm() {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-white mb-2">Newsletter</p>
      <form
        className="flex"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Newsletter signup"
      >
        <input
          type="email"
          placeholder="Your email"
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-l-lg bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-r-lg transition-colors hover:bg-secondary-dark"
        >
          Join
        </button>
      </form>
    </div>
  );
}

import { Link } from 'react-router-dom'
import { Mail, Globe, AtSign, Heart, ShoppingBag } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface-900 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                E-commerce<span className="gradient-text">Store</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your destination for premium products and exceptional shopping experiences. Quality guaranteed.
            </p>
            <div className="flex items-center gap-3">
              {[AtSign, Globe, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 transition-all duration-200 border border-white/10" aria-label="Social media">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/categories', label: 'Categories' },
                { to: '/shop?featured=true', label: 'Featured' },
                { to: '/shop?sort=newest', label: 'New Arrivals' },
                { to: '/shop?sort=popular', label: 'Best Sellers' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-primary-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/account', label: 'My Account' },
                { to: '/orders', label: 'My Orders' },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/cart', label: 'Cart' },
                { to: '/login', label: 'Sign In' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-primary-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe for exclusive deals and product updates.</p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-surface-700 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all"
              />
              <button
                type="submit"
                className="p-2 bg-primary-500 hover:bg-primary-400 text-white rounded-xl transition-colors"
                aria-label="Subscribe"
              >
                <Mail size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} E-commerce Store. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={12} className="text-accent-400 fill-current" /> for CodeAlpha
          </p>
        </div>
      </div>
    </footer>
  )
}

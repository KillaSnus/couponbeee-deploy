import React, { useState } from 'react';
import { ShieldCheck, Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import { db } from '../../lib/db';

interface LegalPageProps {
  pageType:
    | 'about'
    | 'contact'
    | 'affiliate-disclosure'
    | 'privacy'
    | 'terms'
    | 'cookie-policy'
    | 'submit-coupon'
    | 'report-coupon';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType, onNavigate }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const [subForm, setSubForm] = useState({
    store: '',
    url: '',
    code: '',
    discount: '',
    notes: '',
    email: '',
  });
  const [subSent, setSubSent] = useState(false);

  const [repForm, setRepForm] = useState({
    code: '',
    store: '',
    reason: 'code_expired',
    notes: '',
    email: '',
  });
  const [repSent, setRepSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.submitUserCoupon({
      merchantName: subForm.store,
      merchantUrl: subForm.url,
      couponCode: subForm.code,
      discountValue: subForm.discount,
      description: subForm.notes,
      submitterEmail: subForm.email,
    });
    setSubSent(true);
  };

  const handleRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.submitReport({
      couponId: `custom-${Date.now()}`,
      couponTitle: repForm.code,
      merchantName: repForm.store,
      reason: repForm.reason as any,
      userNotes: repForm.notes,
      userEmail: repForm.email,
    });
    setRepSent(true);
  };

  const renderContent = () => {
    switch (pageType) {
      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">About Biorals</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Biorals is an independent consumer savings intelligence platform established to counter the epidemic of expired codes, deceptive discount claims, and scraper spam that plagues the coupon ecosystem.
            </p>
            <h2 className="text-xl font-bold text-slate-900 pt-2">Our Editorial Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h3 className="font-bold text-slate-900">1. Manual Checkout Testing</h3>
                <p className="text-slate-500">We do not auto-publish unverified feeds. Our research staff tests promo codes directly in merchant checkout carts.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h3 className="font-bold text-slate-900">2. Real Test Timestamps</h3>
                <p className="text-slate-500">We display exact verified dates rather than declaring &ldquo;100% working guaranteed&rdquo;.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h3 className="font-bold text-slate-900">3. Source Transparency</h3>
                <p className="text-slate-500">Every coupon logs its origin: official merchant newsletters, direct partnerships, or authorized partner feeds.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h3 className="font-bold text-slate-900">4. Community Feedback</h3>
                <p className="text-slate-500">User reports immediately flag codes for immediate review by our testing desk.</p>
              </div>
            </div>
          </div>
        );

      case 'affiliate-disclosure':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Affiliate Disclosure</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              In compliance with Federal Trade Commission (FTC) guidelines, Biorals maintains full transparency regarding our funding and affiliate partnerships.
            </p>
            <div className="p-5 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 space-y-2">
              <h3 className="font-bold text-sm">How Biorals is Funded</h3>
              <p className="leading-relaxed">
                When you click on coupon buttons, deals, or outbound store links on Biorals, we may earn an affiliate commission from the participating merchant or affiliate network. This commission is paid entirely by the retailer and does not increase the price you pay. In many instances, our exclusive negotiated codes provide lower rates than standard retail pricing.
              </p>
            </div>
            <h2 className="text-lg font-bold text-slate-900 pt-2">Independence of Editorial Ranking</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Affiliate commission rates never dictate coupon ranking, verification status, or merchant evaluations. A non-paying merchant offering a legitimate 50% discount will always receive prominent placement over a paying partner offering an unverified 5% offer.
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Last Updated: September 2026</p>
            <div className="prose prose-slate max-w-none text-xs text-slate-600 space-y-4 leading-relaxed">
              <p>
                Biorals is committed to protecting your privacy. We collect minimal aggregate technical information strictly necessary to operate search recommendations, track coupon success rates, and safeguard platform integrity.
              </p>
              <h3 className="text-sm font-bold text-slate-900">1. Information We Collect</h3>
              <p>We do not collect names, residential addresses, or financial payment details. Outbound click events record anonymous timestamps, destination retailer identifiers, and general user agent strings for analytical verification.</p>
              <h3 className="text-sm font-bold text-slate-900">2. Cookies and Storage</h3>
              <p>We use local browser storage and functional cookies solely to save your recent searches and record coupon helpfulness votes. We do not sell user behavioral data to third-party data brokers.</p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-slate-500">Last Updated: September 2026</p>
            <div className="text-xs text-slate-600 space-y-4 leading-relaxed">
              <p>
                By accessing Biorals, you agree to these Terms. All coupon codes and promotional deals are subject to merchant terms, inventory availability, and regional eligibility. Biorals does not sell products directly and is not responsible for merchant checkout discrepancies.
              </p>
              <h3 className="text-sm font-bold text-slate-900">Accuracy &amp; Verification Disclaimer</h3>
              <p>
                While our team manually tests codes, retailers reserve the right to modify or expire promotional terms at any moment. Always confirm that discounts are reflected in your final merchant order total prior to submitting payment.
              </p>
            </div>
          </div>
        );

      case 'cookie-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cookie Policy</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Biorals uses standard functional cookies and local browser storage to provide responsive search suggestions, remember recently viewed stores, and prevent duplicate helpfulness votes. We do not utilize intrusive cross-site tracking cookies.
            </p>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Biorals Editorial Desk</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Have a partnership inquiry, merchant listing request, or feedback on coupon accuracy? Contact our research and testing analysts below.
            </p>

            {contactSent ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500">
                  Our editorial staff will review your communication and respond within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 max-w-xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Merchant partnership, correction, or general feedback"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        );

      case 'submit-coupon':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Submit a Verified Coupon</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Help fellow shoppers save. Submitted codes are tested by our team in live shopping carts before being added to merchant listings.
            </p>

            {subSent ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2 max-w-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Submission Queued for Testing</h3>
                <p className="text-xs text-slate-500">
                  Thank you! Our testing team will verify your promo code at checkout.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 max-w-xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Store Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hostinger, Nike"
                      value={subForm.store}
                      onChange={(e) => setSubForm({ ...subForm, store: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Website URL *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. hostinger.com"
                      value={subForm.url}
                      onChange={(e) => setSubForm({ ...subForm, url: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SAVE20"
                      value={subForm.code}
                      onChange={(e) => setSubForm({ ...subForm, code: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount Amount *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20% OFF or $15 OFF"
                      value={subForm.discount}
                      onChange={(e) => setSubForm({ ...subForm, discount: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Details &amp; Restrictions</label>
                  <textarea
                    rows={2}
                    placeholder="Where did you get this code? Any minimum spend?"
                    value={subForm.notes}
                    onChange={(e) => setSubForm({ ...subForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  Submit Code for Review
                </button>
              </form>
            )}
          </div>
        );

      case 'report-coupon':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report an Invalid or Expired Coupon</h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Reported codes are re-checked by our analysts within 24 hours. Help us keep savings honest.
            </p>

            {repSent ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2 max-w-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Report Submitted</h3>
                <p className="text-xs text-slate-500">
                  Thank you! Our testing team will re-evaluate this coupon code immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRepSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 max-w-xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Store Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sonos"
                      value={repForm.store}
                      onChange={(e) => setRepForm({ ...repForm, store: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CINEMA15"
                      value={repForm.code}
                      onChange={(e) => setRepForm({ ...repForm, code: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Encountered *</label>
                  <select
                    value={repForm.reason}
                    onChange={(e) => setRepForm({ ...repForm, reason: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="code_expired">Coupon has expired</option>
                    <option value="code_invalid">Code shows as invalid or does not exist</option>
                    <option value="misleading_discount">Discount amount is inaccurate</option>
                    <option value="other">Other restriction</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Details &amp; Error Message</label>
                  <textarea
                    rows={3}
                    placeholder="What did the cart say when you clicked apply?"
                    value={repForm.notes}
                    onChange={(e) => setRepForm({ ...repForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  Send Report
                </button>
              </form>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 capitalize">
          {pageType.replace('-', ' ')}
        </span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
        {renderContent()}
      </div>
    </div>
  );
};

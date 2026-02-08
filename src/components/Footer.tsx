import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="#" className="hover:underline">Help Center</a></li>
                            <li><a href="#" className="hover:underline">Safety information</a></li>
                            <li><a href="#" className="hover:underline">Cancellation options</a></li>
                            <li><a href="#" className="hover:underline">Our COVID-19 Response</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Community</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="#" className="hover:underline">GharSathi.org: disaster relief</a></li>
                            <li><a href="#" className="hover:underline">Support Afghan refugees</a></li>
                            <li><a href="#" className="hover:underline">Combating discrimination</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Hosting</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="#" className="hover:underline">Try hosting</a></li>
                            <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                            <li><a href="#" className="hover:underline">Explore hosting resources</a></li>
                            <li><a href="#" className="hover:underline">Visit our community forum</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">GharSathi</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="#" className="hover:underline">Newsroom</a></li>
                            <li><a href="#" className="hover:underline">Learn about new features</a></li>
                            <li><a href="#" className="hover:underline">Letter from our founders</a></li>
                            <li><a href="#" className="hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:underline">Investors</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <div className="flex flex-wrap items-center gap-4">
                        <p>© 2026 GharSathi, Inc.</p>
                        <span className="hidden md:inline">·</span>
                        <a href="#" className="hover:underline">Privacy</a>
                        <span>·</span>
                        <a href="#" className="hover:underline">Terms</a>
                        <span>·</span>
                        <a href="#" className="hover:underline">Sitemap</a>
                    </div>
                    <div className="flex items-center gap-6 font-semibold">
                        <button className="hover:underline">English (US)</button>
                        <button className="hover:underline">NPR</button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <HomeIcon className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-white text-sm">GharSathi</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                            A rental platform built for students and tenants in Nepal.
                            Find rooms, hostels, and flats near your college or workplace.
                        </p>

                    </div>
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/explore" className="hover:text-white transition-colors">Explore Listings</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white transition-colors">About the Project</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/signup" className="hover:text-white transition-colors">Register as Owner</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Project Info</h4>
                        <ul className="space-y-1.5 text-xs">
                            <li>Tech: React + TypeScript + Vite</li>
                            <li>Backend: Node.js + Express + MongoDB</li>
                            <li>Maps: Leaflet + OpenStreetMap</li>
                            <li>Auth: JWT-based authentication</li>
                        </ul>
                    </div>

                </div>
                <div className="border-t border-gray-800 mt-8 pt-4 text-xs text-center text-gray-600">
                    &copy; {new Date().getFullYear()} GharSathi. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

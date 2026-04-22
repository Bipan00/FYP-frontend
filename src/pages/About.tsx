import React from 'react';
import Navbar from '../components/Navbar';
import SectionTitle from '../components/SectionTitle';

const About: React.FC = () => {
    const techStack = [
        { layer: 'Frontend', tech: 'React 18 + TypeScript', purpose: 'UI layer with type safety' },
        { layer: 'Build Tool', tech: 'Vite', purpose: 'Fast development and bundling' },
        { layer: 'Styling', tech: 'Tailwind CSS', purpose: 'Utility-first CSS framework' },
        { layer: 'Backend', tech: 'Node.js + Express.js', purpose: 'REST API server' },
        { layer: 'Database', tech: 'MongoDB + Mongoose', purpose: 'NoSQL data persistence' },
        { layer: 'Authentication', tech: 'JWT (JSON Web Tokens)', purpose: 'Stateless user auth' },
        { layer: 'Image Storage', tech: 'Cloudinary', purpose: 'Cloud image hosting and CDN' },
        { layer: 'Maps', tech: 'Leaflet + OpenStreetMap', purpose: 'Interactive property maps' },
        { layer: 'Password Security', tech: 'bcrypt', purpose: 'Hashing passwords before storage' },
    ];

    const roles = [
        {
            name: 'Tenant',
            color: 'border-blue-200 bg-blue-50',
            titleColor: 'text-blue-800',
            items: [
                'Browse approved property listings',
                'Filter by location, type, and price',
                'View property details and owner info',
                'Send booking/viewing requests',
                'Track booking request status',
                'Update personal profile',
            ],
        },
        {
            name: 'Owner',
            color: 'border-green-200 bg-green-50',
            titleColor: 'text-green-800',
            items: [
                'Register and log in as an Owner',
                'Add new property listings',
                'Upload property images to Cloudinary',
                'Edit or delete own listings',
                'View booking requests received',
                'Accept or reject booking requests',
            ],
        },
        {
            name: 'Admin',
            color: 'border-red-200 bg-red-50',
            titleColor: 'text-primary',
            items: [
                'View all listings submitted by owners',
                'Approve listings to make them public',
                'Reject inappropriate listings',
                'Has all Owner permissions as well',
                'Access admin-only protected endpoints',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="page-container">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">About GharSathi</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        A Modern Property Rental Platform
                    </p>
                </div>
                <div className="section">
                    <SectionTitle title="Project Purpose" />
                    <div className="text-sm text-gray-700 leading-relaxed space-y-3 max-w-2xl">
                        <p>
                            <strong>GharSathi</strong> (Nepali: ghar = home, sathi = companion) is a
                            web-based rental platform designed to simplify the process of finding
                            accommodation in Nepal. It was built as a final year academic project
                            to demonstrate the development of a full-stack, real-world web application.
                        </p>
                        <p>
                            The platform addresses a common problem faced by students and working
                            professionals in urban Nepal  the lack of a centralized, reliable digital
                            space to find rental properties. Most listings are shared informally through
                            social media or local contacts, which lacks transparency and structure.
                        </p>
                        <p>
                            GharSathi provides a three-role system (Tenant, Owner, Admin) with
                            features including property listing management, booking request workflows,
                            Cloudinary-powered image hosting, Leaflet map integration, and JWT-based
                            authentication.
                        </p>
                    </div>
                </div>
                <div className="section">
                    <SectionTitle
                        title="Technology Stack"
                        subtitle="Technologies used to build this system"
                    />
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Layer
                                    </th>
                                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Technology
                                    </th>
                                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Purpose
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {techStack.map((row) => (
                                    <tr key={row.layer} className="hover:bg-gray-50">
                                        <td className="px-4 py-2.5 font-medium text-gray-700">
                                            {row.layer}
                                        </td>
                                        <td className="px-4 py-2.5 text-primary font-medium">
                                            {row.tech}
                                        </td>
                                        <td className="px-4 py-2.5 text-gray-500">
                                            {row.purpose}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="section">
                    <SectionTitle
                        title="System Roles"
                        subtitle="GharSathi supports three distinct user roles"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {roles.map((role) => (
                            <div
                                key={role.name}
                                className={`border rounded-md p-4 ${role.color}`}
                            >
                                <h3
                                    className={`text-sm font-bold mb-3 ${role.titleColor}`}
                                >
                                    {role.name}
                                </h3>
                                <ul className="space-y-1.5">
                                    {role.items.map((item, i) => (
                                        <li key={i} className="text-xs text-gray-600 flex gap-2">
                                            <span className="text-gray-400 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import apiService from '../services/api';

interface AgreementData {
    tenantName: string;
    ownerName: string;
    propertyTitle: string;
    propertyLocation: string;
    monthlyRent: number;
    generatedDate: string;
}

const AgreementView: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<AgreementData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAgreement = async () => {
            if (!bookingId) return;
            try {
                const res = await apiService.getAgreement(bookingId);
                // We expect getAgreement to return { data: { tenantName, ... } } now
                if (res.data && res.data.tenantName) {
                    setData(res.data);
                } else if (res.data && res.data.agreementDetails) {
                    setData(res.data.agreementDetails);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load agreement');
            } finally {
                setLoading(false);
            }
        };
        fetchAgreement();
    }, [bookingId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <p className="text-red-500 font-medium">{error || 'Agreement not found'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { tenantName, ownerName, propertyTitle, propertyLocation, monthlyRent, generatedDate } = data;
    const formattedDate = new Date(generatedDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-200 py-8 px-4 sm:px-8 font-sans print:bg-white print:py-0 print:px-0 flex flex-col items-center">

            <div className="max-w-[800px] w-full flex justify-between items-center mb-6 print:hidden">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white transition font-medium px-6 py-2 rounded-lg shadow-md"
                >
                    <Printer className="w-4 h-4" /> Save as PDF / Print
                </button>
            </div>

            <div className="max-w-[800px] w-full bg-white shadow-xl print:shadow-none min-h-[1130px] flex flex-col relative overflow-hidden">

                <div className="bg-[#7C3AED] text-white p-8 text-center pb-12 rounded-b-[2rem] mx-4 mt-4 print:mx-0 print:mt-0 print:rounded-none">
                    <h1 className="text-3xl font-bold tracking-wider">GHARSATHI</h1>
                    <p className="text-purple-200 mt-2 text-sm tracking-widest uppercase">Digital Rental Agreement</p>
                </div>

                <div className="px-12 py-8 flex-grow">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 uppercase">Rental Agreement</h2>
                        <p className="text-gray-500 text-sm mt-1">Generated on: {formattedDate}</p>
                        <div className="w-32 h-1 bg-gray-200 mx-auto mt-4"></div>
                    </div>

                    <section className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">1. Parties To This Agreement</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tenant (Lessee)</p>
                                <p className="text-lg font-bold text-gray-900">{tenantName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Owner (Lessor)</p>
                                <p className="text-lg font-bold text-gray-900">{ownerName}</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">2. Property Details</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Property Name & Location</p>
                            <p className="text-lg font-bold text-gray-900">{propertyTitle}</p>
                            <p className="text-gray-600 mt-1">{propertyLocation}</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">3. Financial Terms</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <p className="text-xs text-purple-600 uppercase font-bold tracking-wider mb-1">Monthly Rent</p>
                                <p className="text-2xl font-bold text-purple-900">Rs. {monthlyRent.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Payment Method</p>
                                <p className="font-medium text-gray-900 mt-2">GharSathi Platform (Khalti/Cash)</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">4. Terms & Conditions</h3>
                        <ul className="list-decimal pl-5 space-y-3 text-gray-700 text-sm">
                            <li>The tenant agrees to pay the monthly rent on or before the due date each month.</li>
                            <li>The property shall be used for residential purposes only.</li>
                            <li>The tenant shall keep the property in good condition and report any damage promptly.</li>
                            <li>Either party may terminate this agreement with 30 days written notice.</li>
                            <li>Sub-letting or transferring of the property is not allowed without owner's written consent.</li>
                            <li>The tenant is responsible for their own electricity, water, and utility bills unless otherwise agreed.</li>
                            <li>This agreement was created digitally via the GharSathi platform and is binding upon both parties.</li>
                        </ul>
                    </section>

                    <section className="mt-auto">
                        <div className="grid grid-cols-2 gap-12 mt-16 text-center">
                            <div>
                                <div className="border-b-2 border-dashed border-gray-400 pb-2 mb-2">
                                    <span className="opacity-0">Sign Here</span> {}
                                </div>
                                <p className="font-bold text-gray-900">{tenantName}</p>
                                <p className="text-sm text-gray-500">Tenant Signature</p>
                            </div>
                            <div>
                                <div className="border-b-2 border-dashed border-gray-400 pb-2 mb-2">
                                    <span className="opacity-0">Sign Here</span>
                                </div>
                                <p className="font-bold text-gray-900">{ownerName}</p>
                                <p className="text-sm text-gray-500">Owner Signature</p>
                            </div>
                        </div>
                    </section>

                </div>

                <div className="bg-gray-100 py-4 text-center mt-auto">
                    <p className="text-xs text-gray-500 font-medium tracking-wide">
                        Digitally verified by GharSathi. Ref: {bookingId?.slice(-8).toUpperCase()}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default AgreementView;

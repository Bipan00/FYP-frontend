import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiService from '../services/api';
import { CheckCircle, XCircle, Loader2, Download, Home } from 'lucide-react';

interface ReceiptData {
    transaction_id: string;
    status: string;
    amount?: number;
    description?: string;
    listingTitle?: string;
    ownerName?: string;
    tenantName?: string;
    date?: string;
}

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifyStatus, setVerifyStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Please wait while we verify your payment...');
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const pidx = searchParams.get('pidx');
            const statusParam = searchParams.get('status');

if (statusParam && statusParam !== 'Completed') {
                setVerifyStatus('error');
                setMessage(`Payment was cancelled or failed (Status: ${statusParam}). No money was charged.`);
                return;
            }

            if (!pidx) {
                setVerifyStatus('error');
                setMessage('Invalid payment response. Missing payment reference (pidx).');
                return;
            }

            try {
                const response = await apiService.verifyKhaltiPayment(pidx);
                if (response.status === 'Completed') {
                    setVerifyStatus('success');
                    setMessage('Your payment has been verified and confirmed!');
                    setReceipt({
                        transaction_id: response.transaction_id || pidx,
                        status: 'Completed',
                        amount: response.amount,
                        description: response.description || 'Rent Payment',
                        date: new Date().toLocaleString('en-NP', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                        }),
                    });
                } else {
                    setVerifyStatus('error');
                    setMessage(`Payment status is "${response.status}". Please check your Khalti account or contact support.`);
                }
            } catch (error: any) {
                setVerifyStatus('error');
                setMessage(error.message || 'Payment verification failed. Please contact support with your transaction ID.');
            }
        };

        verifyPayment();
    }, [searchParams]);

const downloadReceipt = async () => {
        if (!receipt) return;

        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        const pidx = searchParams.get('pidx') || 'N/A';
        const pageW = doc.internal.pageSize.getWidth();

doc.setFillColor(93, 46, 142); 
        doc.rect(0, 0, pageW, 38, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('GharSathi', pageW / 2, 16, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Payment Receipt', pageW / 2, 26, { align: 'center' });

doc.setTextColor(34, 197, 94);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('  PAYMENT SUCCESSFUL', pageW / 2, 52, { align: 'center' });

doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(14, 58, pageW - 14, 58);

const rows: [string, string][] = [
            ['Transaction ID', receipt.transaction_id],
            ['Payment Reference (PIDX)', pidx],
            ['Payment Status', 'Completed'],
            ['Description', receipt.description || 'Rent Payment'],
            ['Date & Time', receipt.date || new Date().toLocaleString()],
            ['Payment Method', 'Khalti eWallet'],
            ['Platform', 'GharSathi  Rental Property Platform'],
        ];

        let y = 68;
        doc.setFontSize(11);

        rows.forEach(([label, value], i) => {
            const bg = i % 2 === 0 ? [248, 248, 252] : [255, 255, 255];
            doc.setFillColor(bg[0], bg[1], bg[2]);
            doc.rect(14, y - 5, pageW - 28, 10, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(80, 80, 100);
            doc.text(label + ':', 18, y + 1);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.text(String(value), 90, y + 1);
            y += 13;
        });

y += 8;
        doc.setDrawColor(220, 220, 220);
        doc.line(14, y, pageW - 14, y);
        y += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(140, 140, 140);
        doc.text(
            'This is an auto-generated receipt. Please keep it for your records.',
            pageW / 2, y, { align: 'center' }
        );
        doc.text(
            `Generated on ${new Date().toLocaleString()}  |  GharSathi Platform`,
            pageW / 2, y + 6, { align: 'center' }
        );

        doc.save(`GharSathi_Receipt_${receipt.transaction_id}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full overflow-hidden">

                    {verifyStatus === 'loading' && (
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                                <Loader2 className="h-8 w-8 text-[#5D2E8E] animate-spin" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Verifying Payment</h2>
                            <p className="text-gray-500 mt-2 text-sm">{message}</p>
                        </div>
                    )}

                    {verifyStatus === 'success' && receipt && (
                        <>

                            <div className="bg-gradient-to-r from-[#5D2E8E] to-[#7c3aed] p-8 text-center">
                                <CheckCircle className="h-14 w-14 text-white mx-auto mb-3" />
                                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                                <p className="text-purple-200 mt-1 text-sm">{message}</p>
                            </div>

                            <div className="p-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    Payment Receipt
                                </h3>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Transaction ID', value: receipt.transaction_id },
                                        { label: 'Reference (PIDX)', value: searchParams.get('pidx') || 'N/A' },
                                        { label: 'Status', value: ' Completed', color: 'text-green-600 font-semibold' },
                                        { label: 'Description', value: receipt.description || 'Rent Payment' },
                                        { label: 'Payment Method', value: 'Khalti eWallet' },
                                        { label: 'Date & Time', value: receipt.date },
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-start justify-between py-2 border-b border-gray-50">
                                            <span className="text-sm text-gray-500 w-36 shrink-0">{row.label}</span>
                                            <span className={`text-sm font-medium text-gray-800 text-right break-all ${row.color || ''}`}>
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        onClick={downloadReceipt}
                                        className="flex items-center justify-center gap-2 bg-[#5D2E8E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4d2675] transition-colors w-full"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF Receipt
                                    </button>
                                    <button
                                        onClick={() => navigate('/my-bookings')}
                                        className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-full"
                                    >
                                        <Home className="w-4 h-4" />
                                        Back to My Bookings
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    A copy of this receipt is saved in your booking history.
                                </p>
                            </div>
                        </>
                    )}

                    {verifyStatus === 'error' && (
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Payment Unverified</h2>
                            <p className="text-gray-600 mt-2 mb-6 text-sm max-w-sm">{message}</p>
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors w-full mb-3"
                            >
                                Return to Bookings
                            </button>
                            <p className="text-xs text-gray-400">
                                If money was deducted, it will be refunded automatically by Khalti within 35 business days.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

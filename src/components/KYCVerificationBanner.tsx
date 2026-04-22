interface Props {
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_submitted' | null;
  onVerifyClick: () => void;
}

export default function KYCVerificationBanner({ kycStatus, onVerifyClick }: Props) {
  if (kycStatus === 'verified') return null;
  
  const messages = {
    pending: {
      icon: '',
      title: 'KYC Verification Pending',
      message: 'Your documents are under review. You\'ll receive an email once approved.',
      color: 'yellow',
      action: null
    },
    rejected: {
      icon: '',
      title: 'KYC Verification Rejected',
      message: 'Your KYC documents could not be verified. Please resubmit with valid documents.',
      color: 'red',
      action: 'Resubmit Documents'
    },
    not_submitted: {
      icon: '',
      title: 'KYC Verification Required',
      message: 'Complete KYC verification to create property listings and build trust with tenants.',
      color: 'blue',
      action: 'Verify Now'
    }
  };

const statusKey = (kycStatus === null ? 'not_submitted' : kycStatus) as keyof typeof messages;
  const config = messages[statusKey] || messages.not_submitted;

const colorStyles: Record<string, string> = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorStyles[config.color]} mb-8`}>
      <div className="flex items-start gap-4">
        <span className="text-4xl">{config.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
          <p className="mb-4 opacity-90">{config.message}</p>
          {config.action && (
            <button
              onClick={onVerifyClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover font-medium transition-colors"
            >
              {config.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

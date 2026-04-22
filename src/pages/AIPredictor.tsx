import React, { useState } from 'react';
import {
    MapPin,
    Home,
    BedDouble,
    Sparkles,
    Loader2,
    TrendingUp,
    Building2,
    AlertCircle,
    ChevronDown,
    Cpu,
    Info,
} from 'lucide-react';
import apiService from '../services/api';
import Navbar from '../components/Navbar';

const formatNPR = (n: number) =>
    `NPR ${n.toLocaleString('en-IN')}`;

const getDemandLevel = (price: number) => {
    if (price >= 30000) return { label: 'High Demand', color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' };
    if (price >= 15000) return { label: 'Moderate', color: '#b45309', bg: '#fef3c7', border: '#fde68a' };
    return { label: 'Low Demand', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' };
};

export default function AIPredictor() {

const [area, setArea] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [propertyCategory, setPropertyCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hasResult, setHasResult] = useState(false);

    // Validation states
    const [areaError, setAreaError] = useState('');
    const [bedroomsError, setBedroomsError] = useState('');
    const [categoryError, setCategoryError] = useState('');

    /*  handler  */
    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset validation
        setAreaError('');
        setBedroomsError('');
        setCategoryError('');
        setError(null);
        let hasError = false;

        if (!area.trim()) { setAreaError('Location / Area is required'); hasError = true; }
        if (!propertyCategory) { setCategoryError('Property Category is required'); hasError = true; }
        
        if (!bedrooms) { 
            setBedroomsError('Number of bedrooms is required'); 
            hasError = true; 
        } else if (Number(bedrooms) <= 0) {
            setBedroomsError('Bedrooms must be a valid positive number');
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        setPredictedPrice(null);
        setRecommendations([]);
        setHasResult(false);

let mappedType = 'three bed';
        if (Number(bedrooms) === 1) mappedType = 'one bed';
        if (Number(bedrooms) === 2) mappedType = 'two bed';

const cleanArea = area.trim();
        const formattedArea = cleanArea.charAt(0).toUpperCase() + cleanArea.slice(1).toLowerCase();

        try {
            const predRes = await apiService.post('/api/ai/predict', { area: formattedArea, type: mappedType, category: propertyCategory });
            if (predRes.success) setPredictedPrice(predRes.predicted_price);

            const recRes = await apiService.post('/api/ai/recommend', { area: formattedArea, type: mappedType });
            if (recRes.success) setRecommendations(recRes.recommendations);

            setHasResult(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error: Make sure the Python AI microservice (port 5001) is running.');
        } finally {
            setLoading(false);
        }
    };

    const demand = predictedPrice !== null ? getDemandLevel(predictedPrice) : null;

    const selectStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 36px 10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        background: '#ffffff',
        color: '#374151',
        fontSize: '14px',
        fontFamily: 'Inter, system-ui, sans-serif',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    };

return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .ai-root * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }

                @keyframes ai-fadein {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .ai-fade-0 { animation: ai-fadein 0.4s ease both; }
                .ai-fade-1 { animation: ai-fadein 0.4s 0.08s ease both; }
                .ai-fade-2 { animation: ai-fadein 0.4s 0.16s ease both; }
                .ai-fade-3 { animation: ai-fadein 0.4s 0.24s ease both; }

                .ai-input:focus {
                    border-color: #8B0000 !important;
                    box-shadow: 0 0 0 2px rgba(139,0,0,0.12) !important;
                }
                .ai-select:focus {
                    border-color: #8B0000 !important;
                    box-shadow: 0 0 0 2px rgba(139,0,0,0.12) !important;
                }

                .ai-submit {
                    background: #8B0000;
                    color: #ffffff;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    padding: 12px 28px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: 'Inter', system-ui, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background 0.15s, transform 0.15s;
                    letter-spacing: 0.01em;
                }
                .ai-submit:hover:not(:disabled) { background: #a31515; transform: translateY(-1px); }
                .ai-submit:active:not(:disabled) { transform: scale(0.99); }
                .ai-submit:disabled { opacity: 0.55; cursor: not-allowed; }

                .ai-rec-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    padding: 16px;
                    background: #ffffff;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .ai-rec-card:hover {
                    border-color: #8B0000;
                    box-shadow: 0 2px 8px rgba(139,0,0,0.08);
                }

                .ai-stat-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 12px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 600;
                    border: 1px solid;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .spin { animation: spin 0.75s linear infinite; }
            `}</style>

            <div className="ai-root" style={{ minHeight: '100vh', background: '#ffffff', color: '#374151' }}>
                <Navbar />

                <div style={{
                    background: 'linear-gradient(135deg, #6b1a1a 0%, #8b2e2e 30%, #b85c5c 60%, #f0d9c8 100%)',
                    padding: '40px 24px 36px',
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                        <div className="ai-fade-0" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                            <div style={{
                                width: 44, height: 44,
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Cpu size={22} color="#ffffff" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 style={{
                                    margin: 0,
                                    fontSize: 'clamp(20px, 3vw, 26px)',
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    letterSpacing: '-0.01em',
                                    lineHeight: 1.2,
                                }}>
                                    AI Rent Estimator
                                </h1>
                                <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                                    Intelligent rent predictions calibrated for Nepal's rental market
                                </p>
                            </div>
                        </div>

                        <div className="ai-fade-1" style={{ marginTop: '14px' }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '100px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 500,
                            }}>
                                <Sparkles size={12} />
                                Academic ML Model · Nepal Market Adjusted
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 64px' }}>

                    <div className="ai-fade-1" style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                        marginBottom: '28px',
                    }}>

                        <div style={{
                            padding: '14px 20px',
                            borderBottom: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <div style={{
                                width: 6, height: 6,
                                borderRadius: '50%',
                                background: '#8B0000',
                            }} />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', letterSpacing: '0.01em' }}>
                                Configure Your Estimate
                            </span>
                        </div>

                        <div style={{ padding: '24px 20px' }}>
                            <form onSubmit={handlePredict} noValidate>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '20px',
                                    marginBottom: '24px',
                                }}>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <MapPin size={11} color="#8B0000" /> Location / Area
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={15} color="#9ca3af" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                            <input
                                                type="text"
                                                className="ai-input"
                                                placeholder="e.g. Kathmandu, Pokhara"
                                                value={area}
                                                onChange={e => setArea(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '10px 12px 10px 34px', border: areaError ? '1px solid #ef4444' : '1px solid #d1d5db',
                                                    borderRadius: '6px', fontSize: '14px', color: '#374151', outline: 'none', background: '#ffffff',
                                                    fontFamily: 'Inter, system-ui, sans-serif', transition: 'border-color 0.15s, box-shadow 0.15s'
                                                }}
                                            />
                                        </div>
                                        {areaError && <span style={{ fontSize: '12px', color: '#ef4444' }}>{areaError}</span>}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Building2 size={11} color="#8B0000" /> Property Category
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                className="ai-select"
                                                value={propertyCategory}
                                                onChange={e => setPropertyCategory(e.target.value)}
                                                style={{ ...selectStyle, border: categoryError ? '1px solid #ef4444' : '1px solid #d1d5db' }}
                                            >
                                                <option value="" disabled>Select Type</option>
                                                <option value="Apartment">Apartment (+20%)</option>
                                                <option value="Flat">Flat (+15%)</option>
                                                <option value="Room">Room (Base)</option>
                                                <option value="Hostel">Hostel (−10%)</option>
                                            </select>
                                            <ChevronDown size={14} color="#9ca3af" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                        {categoryError && <span style={{ fontSize: '12px', color: '#ef4444' }}>{categoryError}</span>}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <BedDouble size={11} color="#8B0000" /> Bedrooms
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <BedDouble size={14} color="#9ca3af" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                            <input
                                                type="number"
                                                className="ai-input"
                                                placeholder="e.g. 2"
                                                value={bedrooms}
                                                onChange={e => setBedrooms(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '10px 12px 10px 34px', border: bedroomsError ? '1px solid #ef4444' : '1px solid #d1d5db',
                                                    borderRadius: '6px', fontSize: '14px', color: '#374151', outline: 'none', background: '#ffffff',
                                                    fontFamily: 'Inter, system-ui, sans-serif', transition: 'border-color 0.15s, box-shadow 0.15s'
                                                }}
                                            />
                                        </div>
                                        {bedroomsError && <span style={{ fontSize: '12px', color: '#ef4444' }}>{bedroomsError}</span>}
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="ai-submit">
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="spin" />
                                            Analyzing Market Data…
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Get AI Estimate
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <div className="ai-fade-0" style={{
                                        marginTop: '16px',
                                        padding: '12px 16px',
                                        borderRadius: '6px',
                                        background: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        color: '#dc2626',
                                        fontSize: '13px',
                                        lineHeight: 1.5,
                                    }}>
                                        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {hasResult && !loading && !error && (
                        <div className="ai-fade-2">

                            {predictedPrice !== null && (
                                <div style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: '#ffffff',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                                    overflow: 'hidden',
                                    marginBottom: '28px',
                                }}>

                                    <div style={{
                                        padding: '14px 20px',
                                        borderBottom: '1px solid #f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B0000' }} />
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                                            Estimated Rent
                                        </span>
                                        <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#8B0000',
                                            background: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            borderRadius: '100px',
                                            padding: '2px 10px',
                                            letterSpacing: '0.03em',
                                        }}>
                                            AI · NEPAL ADJUSTED
                                        </span>
                                    </div>

                                    <div style={{ padding: '28px 20px' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                            <div style={{
                                                fontSize: 'clamp(32px, 6vw, 52px)',
                                                fontWeight: 800,
                                                color: '#8B0000',
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1,
                                                marginBottom: '6px',
                                            }}>
                                                {formatNPR(predictedPrice)}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                                                estimated monthly rent
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                            justifyContent: 'center',
                                            marginBottom: '20px',
                                        }}>

                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                border: '1px solid #e5e7eb', borderRadius: '6px',
                                                padding: '10px 16px', background: '#f9fafb',
                                            }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '6px',
                                                    background: '#fef2f2', border: '1px solid #fecaca',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                }}>
                                                    <TrendingUp size={15} color="#8B0000" />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Market Range</div>
                                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginTop: '1px' }}>
                                                        {formatNPR(Math.round(predictedPrice * 0.88))}  {formatNPR(Math.round(predictedPrice * 1.12))}
                                                    </div>
                                                </div>
                                            </div>

                                            {demand && (
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    border: '1px solid #e5e7eb', borderRadius: '6px',
                                                    padding: '10px 16px', background: '#f9fafb',
                                                }}>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: '6px',
                                                        background: demand.bg, border: `1px solid ${demand.border}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                    }}>
                                                        <Home size={15} color={demand.color} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Demand Level</div>
                                                        <div style={{ fontSize: '13px', fontWeight: 700, color: demand.color, marginTop: '1px' }}>{demand.label}</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                border: '1px solid #e5e7eb', borderRadius: '6px',
                                                padding: '10px 16px', background: '#f9fafb',
                                            }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '6px',
                                                    background: '#fef2f2', border: '1px solid #fecaca',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                }}>
                                                    <Building2 size={15} color="#8B0000" />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Property</div>
                                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginTop: '1px' }}>
                                                        {propertyCategory} · {bedrooms}BR
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex', alignItems: 'flex-start', gap: '8px',
                                            padding: '10px 14px',
                                            background: '#fffbf0',
                                            border: '1px solid #fde68a',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            color: '#92400e',
                                            lineHeight: 1.6,
                                        }}>
                                            <Info size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>
                                                <strong>Academic Estimate Only.</strong> This prediction is derived from an international ML dataset, post-processed and adjusted for Nepal's rental market conditions. It should not be used as a definitive valuation.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {recommendations.length > 0 && (
                                <div className="ai-fade-3">

                                    <div style={{ marginBottom: '12px', padding: '0 2px' }}>
                                        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827', borderLeft: '2px solid #8B0000', paddingLeft: '10px' }}>
                                            Similar Listed Properties
                                        </h2>
                                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', paddingLeft: '12px' }}>
                                            AI-recommended listings matching your search criteria
                                        </p>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                        gap: '12px',
                                    }}>
                                        {recommendations.map((rec, index) => (
                                            <div
                                                key={index}
                                                className="ai-rec-card"
                                                style={{ animationDelay: `${index * 0.06}s` }}
                                            >

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: '6px',
                                                        background: '#fef2f2',
                                                        border: '1px solid #fecaca',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <Home size={16} color="#8B0000" />
                                                    </div>
                                                    <span style={{
                                                        background: '#fef2f2',
                                                        border: '1px solid #fecaca',
                                                        color: '#8B0000',
                                                        fontWeight: 700,
                                                        fontSize: '12px',
                                                        padding: '3px 10px',
                                                        borderRadius: '100px',
                                                    }}>
                                                        Rs. {rec.price?.toLocaleString() ?? ''}
                                                    </span>
                                                </div>

                                                <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                                                    {rec.type}
                                                </h3>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '12px' }}>
                                                    <MapPin size={12} color="#8B0000" />
                                                    {rec.area}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

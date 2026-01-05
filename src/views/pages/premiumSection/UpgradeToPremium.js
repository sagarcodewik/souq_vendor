import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { subscribeVendor, fetchVendorProfile } from '../../../redux/slice/profile';
import {
    CButton
} from '@coreui/react';
import styles from './upgrade.module.scss';
import Loader from '../../../components/loader/loader';

// Icon components
const CheckIcon = ({ className = "" }) => (
    <svg className={`${styles.checkIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ZapIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const CrownIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
    </svg>
);

const UpgradeToPremium = () => {
    const [selectedPlan, setSelectedPlan] = useState('Quarterly');
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const plans = [
        {
            id: 'Monthly',
            name: 'Monthly Plan',
            price: '10 SYP',
            period: 'per month',
            description: 'Perfect for trying premium features',
            badge: null,
            icon: ZapIcon,
            features: [
                'Premium product listings',
                'Advanced analytics',
                'Priority customer support',
                'Enhanced visibility'
            ],
            colorClass: 'monthlyPlan',
            borderClass: 'monthlyBorder'
        },
        {
            id: 'Quarterly',
            name: 'Quarterly Plan',
            price: '25 SYP',
            period: 'per 3 months',
            description: 'Best balance of features and savings',
            badge: 'POPULAR',
            icon: ShieldIcon,
            features: [
                'All Monthly features',
                'Bulk product management',
                'Advanced reporting tools',
                'Custom branding options',
                '17% savings vs monthly'
            ],
            colorClass: 'quarterlyPlan',
            borderClass: 'quarterlyBorder'
        },
        {
            id: 'Yearly',
            name: 'Yearly Plan',
            price: '90 SYP',
            period: 'per year',
            description: 'Maximum value with premium benefits',
            badge: 'BEST VALUE',
            icon: CrownIcon,
            features: [
                'All Quarterly features',
                'Dedicated account manager',
                'API access & integrations',
                'White-label solutions',
                'Priority feature requests',
                '25% savings vs monthly'
            ],
            colorClass: 'yearlyPlan',
            borderClass: 'yearlyBorder'
        }
    ];

    const handleApply = async () => {
        setSubmitting(true);
        try {
            await dispatch(subscribeVendor(selectedPlan)).unwrap();
            await dispatch(fetchVendorProfile()).unwrap();
            navigate('/dashboard/profile');
        } catch (err) {
            console.error('Subscription failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Choose Your Premium Plan</h1>
                    <p className={styles.subtitle}>
                        Unlock powerful features and grow your business with our premium subscription plans. 
                        Choose the plan that best fits your needs.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className={styles.plansGrid}>
                    {plans.map((plan) => {
                        const IconComponent = plan.icon;
                        const isSelected = selectedPlan === plan.id;
                        const isPopular = plan.badge === 'POPULAR';
                        
                        return (
                            <div
                                key={plan.id}
                                className={`${styles.planCard} ${isSelected ? styles.selected : ''} ${styles[plan.borderClass]} ${isPopular ? styles.popular : ''}`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div className={`${styles.badge} ${plan.badge === 'POPULAR' ? styles.popularBadge : styles.bestValueBadge}`}>
                                        {plan.badge}
                                    </div>
                                )}

                                {/* Selection Radio */}
                                <div className={styles.radioButton}>
                                    <div className={`${styles.radio} ${isSelected ? styles.radioSelected : ''}`}>
                                        {isSelected && <div className={styles.radioDot}></div>}
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    {/* Plan Header */}
                                    <div className={styles.planHeader}>
                                        <div className={`${styles.iconWrapper} ${styles[plan.colorClass]}`}>
                                            <IconComponent />
                                        </div>
                                        <div className={styles.planInfo}>
                                            <h3 className={styles.planName}>{plan.name}</h3>
                                            <p className={styles.planDescription}>{plan.description}</p>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className={styles.pricing}>
                                        <span className={styles.price}>{plan.price}</span>
                                        <span className={styles.period}>{plan.period}</span>
                                    </div>

                                    {/* Features */}
                                    <div className={styles.features}>
                                        <h4 className={styles.featuresTitle}>What's included:</h4>
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className={styles.feature}>
                                                <CheckIcon />
                                                <span className={styles.featureText}>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Selected Overlay */}
                                {isSelected && <div className={styles.selectedOverlay}></div>}
                            </div>
                        );
                    })}
                </div>

                {/* Action Button */}
                <div className={styles.actionSection}>
                    <CButton
                        className={styles.confirmButton}
                        disabled={submitting}
                        onClick={handleApply}
                    >
                        {submitting ? (
                            <div className={styles.loadingContent}>
                                <div className={styles.spinner}></div>
                                Processing...
                            </div>
                        ) : (
                            `Confirm & Apply ${selectedPlan} Plan`
                        )}
                    </CButton>
                </div>

                {/* Features Comparison Table */}
                <div className={styles.comparisonTable}>
                    <h2 className={styles.comparisonTitle}>Compare All Features</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.tableHeader}>
                                    <th className={styles.tableHeaderCell}>Features</th>
                                    <th className={styles.tableHeaderCellCenter}>Monthly</th>
                                    <th className={styles.tableHeaderCellCenter}>Quarterly</th>
                                    <th className={styles.tableHeaderCellCenter}>Yearly</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tableCell}>Premium product listings</td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tableCell}>Advanced analytics</td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tableCell}>Bulk product management</td>
                                    <td className={styles.tableCellCenter}>-</td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tableCell}>API access & integrations</td>
                                    <td className={styles.tableCellCenter}>-</td>
                                    <td className={styles.tableCellCenter}>-</td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tableCell}>Dedicated account manager</td>
                                    <td className={styles.tableCellCenter}>-</td>
                                    <td className={styles.tableCellCenter}>-</td>
                                    <td className={styles.tableCellCenter}><CheckIcon className={styles.tableCheckIcon} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeToPremium;
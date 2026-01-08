import React from 'react';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { TermsOfService } from '../components/TermsOfService';
import { PopiaCompliance } from '../components/PopiaCompliance';

export const PrivacyPage: React.FC = () => <PrivacyPolicy />;
export const TermsPage: React.FC = () => <TermsOfService />;
export const PopiaPage: React.FC = () => <PopiaCompliance />;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { mockDataService } from '../../../services/mockDataService';
import CompanyForm from '../components/CompanyForm';
import {
    Globe,
    Code,
    Building2,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Linkedin,
    Github,
    Edit3,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard, PremiumButton } from '../../../components/shared/PremiumComponents';

export default function CompanyProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const { data: company, isLoading } = useQuery({
        queryKey: ['company-profile'],
        queryFn: mockDataService.getCompanyProfile,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (updatedData) => {
            return new Promise(resolve => {
                resolve(mockDataService.updateCompanyProfile(updatedData));
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['company-profile']);
            setIsEditing(false);
        }
    });

    const handleSave = (updatedData) => {
        updateProfileMutation.mutate(updatedData);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading company profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <FloatingOrbs count={10} />
            <AnimatedGrid />

            <motion.div
                className="relative z-10 p-6 md:p-8 max-w-6xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header/Hero Section */}
                <motion.div variants={itemVariants}>
                    <PremiumCard className="overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
                            <div className="absolute top-4 right-4">
                                <PremiumButton
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Edit Profile</span>
                                </PremiumButton>
                            </div>
                        </div>

                        <div className="px-6 pb-6 md:px-8 md:pb-8">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                {/* Logo */}
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-700 p-2 shadow-xl border-2 border-slate-600/50 shrink-0 -mt-12 md:-mt-16 relative">
                                    <img
                                        src={company.logo}
                                        alt="Logo"
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>

                                {/* Company Info */}
                                <div className="flex-1 text-center md:text-left pt-2 md:pt-4">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-black text-white">{company.name}</h1>
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-xl border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-xl">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Verified Business
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                                        {company.description}
                                    </p>
                                </div>

                                {/* Social Icons */}
                                <div className="flex gap-2 shrink-0 md:pt-4">
                                    <motion.a
                                        href={`https://${company.socials.linkedin}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 bg-slate-700/50 hover:bg-[#0077b5] text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all backdrop-blur-xl border border-slate-600/50"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </motion.a>
                                    <motion.a
                                        href={`https://${company.socials.github}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 bg-slate-700/50 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all backdrop-blur-xl border border-slate-600/50"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Github className="w-5 h-5" />
                                    </motion.a>
                                    <motion.a
                                        href={`https://${company.website}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 bg-slate-700/50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all backdrop-blur-xl border border-slate-600/50"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Globe className="w-5 h-5" />
                                    </motion.a>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact & Legal Info */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <PremiumCard className="p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-400" />
                                Contact Details
                            </h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                    <span className="text-slate-300">{company.email}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                    <span className="text-slate-300">{company.phone}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                    <span className="text-slate-300">
                                        {company.headquarters.street}<br />
                                        {company.headquarters.city}, {company.headquarters.state} {company.headquarters.zip}<br />
                                        {company.headquarters.country}
                                    </span>
                                </li>
                            </ul>
                        </PremiumCard>

                        <PremiumCard className="p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Legal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Legal Name</p>
                                    <p className="font-semibold text-white">{company.legalName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Tax ID / EIN</p>
                                        <p className="font-mono text-xs font-semibold text-slate-300 bg-slate-700/50 px-2 py-1.5 rounded-lg inline-block border border-slate-600/50">
                                            {company.taxId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">VAT Number</p>
                                        <p className="font-mono text-xs font-semibold text-slate-300 bg-slate-700/50 px-2 py-1.5 rounded-lg inline-block border border-slate-600/50">
                                            {company.vatNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Global Ops & Tech */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        {/* Global Operations */}
                        <PremiumCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-indigo-400" />
                                    Global Operations
                                </h3>
                                <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-500/30 backdrop-blur-xl">
                                    Active for Trading
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 mb-3 font-semibold">Operating Regions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {company.operatingRegions.map(region => (
                                            <span key={region} className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs rounded-lg font-medium backdrop-blur-xl">
                                                {region}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-3 font-semibold">Supported Currencies</p>
                                    <div className="flex gap-2">
                                        {company.currencies.map(curr => (
                                            <span key={curr} className="w-10 h-10 flex items-center justify-center bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 backdrop-blur-xl">
                                                {curr}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>

                        {/* Tech Stack */}
                        <PremiumCard className="p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Code className="w-4 h-4 text-purple-400" />
                                Technology Stack
                            </h3>
                            <p className="text-sm text-slate-400 mb-4">
                                Strategic deployment of modern frameworks for our internal ERP and D2C e-commerce platforms.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {company.techStack.map(tech => (
                                    <span key={tech} className="px-3 py-2 bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 text-xs font-mono rounded-xl border border-slate-600/50 shadow-lg backdrop-blur-xl">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </PremiumCard>

                        {/* System Health */}
                        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500/30">
                            <h3 className="text-sm font-bold text-emerald-300 mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                System Health & Integrations
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-slate-300">ERP Core: <strong className="text-white">Online</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-slate-300">Payment Gateways: <strong className="text-white">Connected</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-slate-300">CDN: <strong className="text-white">Active</strong></span>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>
                </div>
            </motion.div>

            <CompanyForm
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                initialData={company}
                onSave={handleSave}
            />
        </div>
    );
}

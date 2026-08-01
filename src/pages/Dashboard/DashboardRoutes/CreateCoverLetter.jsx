import { useContext, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
    Sparkles, Download, Printer, Trash2, Clock, User, Briefcase,
    Building, FileText, Award, Copy, Check, AlertCircle, Loader2,
    RefreshCw, Edit3, Save, Camera, X, ChevronDown, ChevronUp,
    GraduationCap, Plus, Mail, Phone, MapPin, Globe, 
    GitBranch, Share2, Link2
} from 'lucide-react';
import { Authcontext } from '../../../context/Authprovider';
import Useaxios from '../../../hooks/Useaxios';
import LoadingSpinner from '../../../component/shared/LoadingSpinner';
import CoverLetterHistory from './CoverLetterHistory';

// ==================== CONSTANTS ====================
const TONES = [
    { key: 'professional', label: '💼 Professional' },
    { key: 'confident', label: '🔥 Confident' },
    { key: 'enthusiastic', label: '⭐ Enthusiastic' }
];

const makeEmptyEducation = (id) => ({ 
    id, 
    level: '', 
    institution: '', 
    field: '', 
    year: '' 
});

const emptyForm = {
    name: '', email: '', phone: '', location: '', photoUrl: '',
    companyName: '', jobTitle: '', jobPostUrl: '', jobLocation: '',
    educations: [makeEmptyEducation('edu-1'), makeEmptyEducation('edu-2')],
    skills: '', experience: '', projects: '', certifications: '',
    github: '', portfolio: '', linkedin: '',
    whyJob: '', whyHire: '', tone: 'professional', jobDescription: ''
};

const inputCls = "w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm";

// ==================== HELPERS ====================
const urlToArrayBuffer = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Image fetch failed');
    return res.arrayBuffer();
};

const urlToDataUrl = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Image fetch failed');
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// ==================== SECTION COMPONENT ====================
const Section = ({ id, title, icon, children, openSection, setOpenSection }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
        <button
            type="button"
            onClick={() => setOpenSection(openSection === id ? '' : id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
            <span className="font-medium text-slate-700 flex items-center gap-2">
                {icon} {title}
            </span>
            {openSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence mode="wait">
            {openSection === id && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 space-y-3">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// ==================== MAIN COMPONENT ====================
const CreateCoverLetter = () => {
    const { user } = useContext(Authcontext);
    const axios = Useaxios();
    const fileInputRef = useRef(null);

    const [loadingHistory, setLoadingHistory] = useState(true);
    const [letters, setLetters] = useState([]);
    const [activeLetter, setActiveLetter] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);
    const [openSection, setOpenSection] = useState('basic');
    const [exportingType, setExportingType] = useState(null);

    const [form, setForm] = useState({
        ...emptyForm,
        name: user?.displayName || '',
        email: user?.email || ''
    });

    // ===== API Calls =====
    const fetchHistory = async () => {
        if (!user?.email) return;
        try {
            setLoadingHistory(true);
            const res = await axios.get(`/api/cover-letters/${user.email}`);
            setLetters(res.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load history');
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        setForm(prev => ({
            ...prev,
            name: user?.displayName || prev.name,
            email: user?.email || prev.email
        }));
    }, [user?.email]);

    // ===== Handlers =====
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const updateEducation = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            educations: prev.educations.map((edu, i) => 
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const addEducation = () => {
        setForm(prev => ({
            ...prev,
            educations: [...prev.educations, makeEmptyEducation(`edu-${Date.now()}`)]
        }));
    };

    const removeEducation = (index) => {
        if (index < 2) return;
        setForm(prev => ({
            ...prev,
            educations: prev.educations.filter((_, i) => i !== index)
        }));
    };

    const handlePhotoSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingPhoto(true);
            const formData = new FormData();
            formData.append('photo', file);
            const res = await axios.post('/api/cover-letter/upload-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleChange('photoUrl', res.data?.data?.photoUrl);
            toast.success('Photo uploaded! 📸');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

   const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!form.jobTitle.trim() || !form.companyName.trim()) {
        toast.warn('Please provide Job Title and Company Name');
        return;
    }

    const filledEducations = form.educations.filter(edu => edu.level.trim() && edu.institution.trim());
    if (filledEducations.length < 2) {
        toast.warn("Please provide at least 2 education entries (e.g., HSC + Bachelor's)");
        setOpenSection('professional');
        return;
    }

    // Education text for display (fallback)
    const educationText = filledEducations
        .map(edu => `${edu.level}${edu.field ? ' in ' + edu.field : ''} from ${edu.institution}${edu.year ? ' (' + edu.year + ')' : ''}`)
        .join('; ');

    try {
        setGenerating(true);
        setActiveLetter(null);
        setIsEditing(false);
        
        // Send both education text AND educations array
        const res = await axios.post('/api/cover-letter/generate', {
            userEmail: user.email,
            ...form,
            education: educationText,
            educations: filledEducations // 👈 এইটা গুরুত্বপূর্ণ
        });
        
        const newLetter = res.data?.data;
        setActiveLetter(newLetter);
        setLetters(prev => [newLetter, ...prev]);
        toast.success('Cover letter generated! ✨');
    } catch (error) {
        console.error(error);
        toast.error('Failed to generate cover letter');
    } finally {
        setGenerating(false);
    }
};

 const handleRegenerate = async () => {
    if (!activeLetter) return;
    try {
        setRegenerating(true);
        const res = await axios.post(`/api/cover-letter/${activeLetter._id}/regenerate`, {
            tone: activeLetter.tone || 'professional',
            jobTitle: activeLetter.jobTitle,
            companyName: activeLetter.companyName,
            education: activeLetter.education,
            educations: activeLetter.educations, // 👈 শিক্ষা অ্যারে পাঠান
            skills: activeLetter.skills,
            experience: activeLetter.experience,
            projects: activeLetter.projects,
            whyJob: activeLetter.whyJob,
            whyHire: activeLetter.whyHire,
            certifications: activeLetter.certifications,
            github: activeLetter.github,
            portfolio: activeLetter.portfolio,
            linkedin: activeLetter.linkedin,
            location: activeLetter.location
        });
        
        const updated = { 
            ...activeLetter, 
            content: res.data?.data?.content,
            regeneratedAt: new Date().toISOString()
        };
        setActiveLetter(updated);
        setLetters(prev => prev.map(l => l._id === updated._id ? updated : l));
        toast.success('Regenerated! 🔄');
    } catch (error) {
        console.error(error);
        toast.error('Failed to regenerate');
    } finally {
        setRegenerating(false);
    }
};

    const handleSelectLetter = (letter) => {
        setActiveLetter(letter);
        setIsEditing(false);
    };

    const startEditing = () => {
        setEditedContent(activeLetter.content);
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!editedContent.trim()) {
            toast.warn('Content cannot be empty');
            return;
        }
        try {
            setSavingEdit(true);
            await axios.patch(`/api/cover-letter/${activeLetter._id}`, { content: editedContent });
            const updated = { ...activeLetter, content: editedContent, edited: true };
            setActiveLetter(updated);
            setLetters(prev => prev.map(l => l._id === updated._id ? updated : l));
            setIsEditing(false);
            toast.success('Saved! 💾');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save');
        } finally {
            setSavingEdit(false);
        }
    };

    const handleCopy = async (content, id) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            toast.success('Copied! 📋');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    // ===== Enhanced PDF Download with Image =====
    const handleDownloadPDF = async (letter) => {
        try {
            setExportingType('pdf');
            const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
            const marginX = 56;
            const pageWidth = pdf.internal.pageSize.getWidth();
            let y = 50;

            if (letter.photoUrl) {
                try {
                    const dataUrl = await urlToDataUrl(letter.photoUrl);
                    const imgSize = 80;
                    pdf.addImage(
                        dataUrl, 
                        'JPEG', 
                        pageWidth - marginX - imgSize, 
                        y - 20, 
                        imgSize, 
                        imgSize,
                        undefined,
                        'FAST'
                    );
                } catch (imgErr) {
                    console.error('Photo could not be added to PDF:', imgErr);
                }
            }

            // Name
            pdf.setFont('times', 'bold');
            pdf.setFontSize(20);
            pdf.text(letter.name || 'Applicant', marginX, y);
            y += 22;

            // Contact info
            pdf.setFont('times', 'normal');
            pdf.setFontSize(10);
            const contactParts = [];
            if (letter.email) contactParts.push(letter.email);
            if (letter.phone) contactParts.push(letter.phone);
            if (letter.location) contactParts.push(letter.location);
            if (contactParts.length) {
                pdf.text(contactParts.join('  •  '), marginX, y);
                y += 14;
            }

            // Links
            const linkParts = [];
            if (letter.portfolio) linkParts.push(letter.portfolio);
            if (letter.github) linkParts.push(letter.github);
            if (letter.linkedin) linkParts.push(letter.linkedin);
            if (linkParts.length) {
                pdf.setTextColor(79, 70, 229);
                pdf.text(linkParts.join('  •  '), marginX, y);
                pdf.setTextColor(0, 0, 0);
                y += 14;
            }

            y += 8;
            pdf.setDrawColor(200);
            pdf.line(marginX, y, pageWidth - marginX, y);
            y += 24;

            // Education Table
            if (letter.educations && letter.educations.length > 0) {
                pdf.setFontSize(10);
                pdf.setTextColor(100);
                pdf.text('Education:', marginX, y);
                y += 16;
                
                // Table headers
                const col1 = marginX;
                const col2 = marginX + 120;
                const col3 = marginX + 250;
                const col4 = marginX + 370;
                
                pdf.setFont('times', 'bold');
                pdf.setTextColor(60);
                pdf.text('Level', col1, y);
                pdf.text('Institution', col2, y);
                pdf.text('Field', col3, y);
                pdf.text('Year', col4, y);
                y += 14;
                
                pdf.setDrawColor(200);
                pdf.line(marginX, y - 4, pageWidth - marginX, y - 4);
                
                pdf.setFont('times', 'normal');
                pdf.setTextColor(0);
                
                letter.educations.forEach((edu, idx) => {
                    if (idx > 0) {
                        pdf.setDrawColor(230, 230, 230);
                        pdf.line(marginX, y - 2, pageWidth - marginX, y - 2);
                    }
                    pdf.text(edu.level || '-', col1, y);
                    pdf.text(edu.institution || '-', col2, y);
                    pdf.text(edu.field || '-', col3, y);
                    pdf.text(edu.year || '-', col4, y);
                    y += 16;
                });
                y += 8;
                pdf.setTextColor(0);
            }

            // Date
            const dateStr = new Date(letter.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            pdf.text(dateStr, pageWidth - marginX, y, { align: 'right' });
            y += 20;

            // Recipient
            pdf.setFontSize(11);
            pdf.text('Hiring Manager', marginX, y);
            y += 14;
            pdf.text(letter.companyName, marginX, y);
            y += 14;
            if (letter.jobLocation) {
                pdf.text(letter.jobLocation, marginX, y);
                y += 14;
            }
            y += 16;

            // Body
            const lines = pdf.splitTextToSize(letter.content, pageWidth - marginX * 2);
            pdf.text(lines, marginX, y);

            // Signature
            y += lines.length * 14 + 20;
            pdf.setFont('times', 'italic');
            pdf.setFontSize(11);
            pdf.text('Sincerely,', marginX, y);
            y += 20;
            pdf.setFont('times', 'bold');
            pdf.text(letter.name || 'Applicant', marginX, y);

            pdf.save(`CoverLetter-${letter.companyName.replace(/\s+/g, '_')}.pdf`);
            toast.success('PDF downloaded! 📥');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create PDF');
        } finally {
            setExportingType(null);
        }
    };

    // ===== Enhanced DOCX Download with Image =====
    const handleDownloadDOCX = async (letter) => {
        try {
            setExportingType('docx');
            const dateStr = new Date(letter.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const children = [];

            // Photo (right aligned)
            if (letter.photoUrl) {
                try {
                    const arrayBuffer = await urlToArrayBuffer(letter.photoUrl);
                    children.push(
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new ImageRun({
                                    data: arrayBuffer,
                                    transformation: { width: 100, height: 100 }
                                })
                            ]
                        })
                    );
                } catch (imgErr) {
                    console.error('Photo could not be added to DOCX:', imgErr);
                }
            }

            children.push(
                new Paragraph({
                    children: [new TextRun({ text: letter.name || 'Applicant', bold: true, size: 40 })]
                }),
                new Paragraph({
                    children: [new TextRun({
                        text: [letter.email, letter.phone, letter.location].filter(Boolean).join('  •  '),
                        size: 20,
                        color: '555555'
                    })]
                })
            );

            const linkText = [letter.portfolio, letter.github, letter.linkedin].filter(Boolean).join('  •  ');
            if (linkText) {
                children.push(new Paragraph({
                    children: [new TextRun({
                        text: linkText,
                        size: 20,
                        color: '4f46e5'
                    })]
                }));
            }

            children.push(new Paragraph({ text: '' }));

            // Education Table
            if (letter.educations && letter.educations.length > 0) {
                children.push(
                    new Paragraph({
                        children: [new TextRun({ text: 'Education:', bold: true, size: 22 })]
                    })
                );
                
                // Table header
                const headerRow = new Paragraph({
                    children: [
                        new TextRun({ text: 'Level', bold: true, size: 20 }),
                        new TextRun({ text: '  |  ', size: 20 }),
                        new TextRun({ text: 'Institution', bold: true, size: 20 }),
                        new TextRun({ text: '  |  ', size: 20 }),
                        new TextRun({ text: 'Field', bold: true, size: 20 }),
                        new TextRun({ text: '  |  ', size: 20 }),
                        new TextRun({ text: 'Year', bold: true, size: 20 })
                    ]
                });
                children.push(headerRow);
                children.push(new Paragraph({ text: '----------------------------------------' }));

                letter.educations.forEach(edu => {
                    const row = new Paragraph({
                        children: [
                            new TextRun({ text: edu.level || '-', size: 20 }),
                            new TextRun({ text: '  |  ', size: 20 }),
                            new TextRun({ text: edu.institution || '-', size: 20 }),
                            new TextRun({ text: '  |  ', size: 20 }),
                            new TextRun({ text: edu.field || '-', size: 20 }),
                            new TextRun({ text: '  |  ', size: 20 }),
                            new TextRun({ text: edu.year || '-', size: 20 })
                        ]
                    });
                    children.push(row);
                });
                children.push(new Paragraph({ text: '' }));
            }

            children.push(
                new Paragraph({
                    children: [new TextRun({ text: dateStr, size: 20, color: '666666' })]
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: 'Hiring Manager', size: 22 })] }),
                new Paragraph({ children: [new TextRun({ text: letter.companyName, size: 22, bold: true })] }),
                ...(letter.jobLocation ? [new Paragraph({ children: [new TextRun({ text: letter.jobLocation, size: 22 })] })] : []),
                new Paragraph({ text: '' }),
                ...letter.content.split('\n').map(line =>
                    new Paragraph({ children: [new TextRun({ text: line, size: 22 })] })
                ),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [new TextRun({ text: 'Sincerely,', size: 22, italics: true })]
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [new TextRun({ text: letter.name || 'Applicant', size: 22, bold: true })]
                })
            );

            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `CoverLetter-${letter.companyName.replace(/\s+/g, '_')}.docx`);
            toast.success('DOCX downloaded! 📥');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create DOCX');
        } finally {
            setExportingType(null);
        }
    };

    // ===== Enhanced Print with Image =====
    const handlePrint = (letter) => {
        const printWindow = window.open('', '_blank', 'width=900,height=1000');
        if (!printWindow) {
            toast.error('Popup blocked! Please allow popups.');
            return;
        }

        const dateStr = new Date(letter.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const contactLine = [letter.email, letter.phone, letter.location].filter(Boolean).join('  •  ');
        const linkLine = [letter.portfolio, letter.github, letter.linkedin].filter(Boolean).join('  •  ');

        // Education Table HTML
        let educationHtml = '';
        if (letter.educations && letter.educations.length > 0) {
            educationHtml = `
                <div class="education-section">
                    <p class="edu-title">📚 Education</p>
                    <table class="edu-table">
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th>Institution</th>
                                <th>Field</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${letter.educations.map(edu => `
                                <tr>
                                    <td>${edu.level || '-'}</td>
                                    <td>${edu.institution || '-'}</td>
                                    <td>${edu.field || '-'}</td>
                                    <td>${edu.year || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cover Letter - ${letter.companyName}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Georgia', 'Times New Roman', serif;
                        max-width: 750px;
                        margin: 40px auto;
                        padding: 40px 50px;
                        line-height: 1.8;
                        color: #1a1a2e;
                        background: #ffffff;
                        border: 1px solid #e8e8e8;
                        border-radius: 8px;
                        box-shadow: 0 2px 20px rgba(0,0,0,0.06);
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #e8e8e8;
                        padding-bottom: 20px;
                        margin-bottom: 20px;
                    }
                    .name-section {
                        flex: 1;
                    }
                    .name {
                        font-size: 26px;
                        font-weight: bold;
                        color: #1a1a2e;
                        letter-spacing: 0.5px;
                    }
                    .contact {
                        font-size: 12px;
                        color: #555;
                        margin-top: 4px;
                    }
                    .links {
                        font-size: 12px;
                        color: #4f46e5;
                        margin-top: 2px;
                    }
                    .date {
                        font-size: 12px;
                        color: #888;
                        white-space: nowrap;
                        margin-left: 20px;
                    }
                    .photo {
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border: 2px solid #e8e8e8;
                        border-radius: 4px;
                        margin-left: 20px;
                        flex-shrink: 0;
                    }
                    .education-section {
                        margin: 16px 0;
                        padding: 12px;
                        background: #f8f8f8;
                        border-radius: 6px;
                    }
                    .edu-title {
                        font-weight: bold;
                        font-size: 14px;
                        margin-bottom: 8px;
                        color: #333;
                    }
                    .edu-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 12px;
                    }
                    .edu-table th {
                        text-align: left;
                        padding: 6px 8px;
                        border-bottom: 2px solid #ddd;
                        font-weight: bold;
                        color: #555;
                    }
                    .edu-table td {
                        padding: 6px 8px;
                        border-bottom: 1px solid #eee;
                    }
                    .recipient {
                        font-size: 14px;
                        margin-bottom: 24px;
                        line-height: 1.6;
                    }
                    .recipient p {
                        margin: 2px 0;
                    }
                    .content {
                        white-space: pre-line;
                        font-size: 15px;
                        line-height: 1.9;
                        color: #1a1a2e;
                    }
                    .content p {
                        margin-bottom: 12px;
                    }
                    .signature {
                        margin-top: 30px;
                        padding-top: 16px;
                        border-top: 1px solid #e8e8e8;
                    }
                    .signature .sincerely {
                        font-style: italic;
                        font-size: 14px;
                        color: #555;
                    }
                    .signature .name {
                        font-size: 16px;
                        font-weight: bold;
                        margin-top: 4px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 12px;
                        border-top: 1px solid #e8e8e8;
                        font-size: 10px;
                        color: #aaa;
                        text-align: center;
                    }
                    @media print {
                        body {
                            border: none;
                            box-shadow: none;
                            margin: 20px auto;
                            padding: 20px 30px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="name-section">
                        <div class="name">${letter.name || 'Applicant'}</div>
                        ${contactLine ? `<div class="contact">${contactLine}</div>` : ''}
                        ${linkLine ? `<div class="links">${linkLine}</div>` : ''}
                    </div>
                    ${letter.photoUrl ? `<img class="photo" src="${letter.photoUrl}" alt="Profile" />` : ''}
                    <div class="date">${dateStr}</div>
                </div>

                ${educationHtml}

                <div class="recipient">
                    <p><strong>Hiring Manager</strong></p>
                    <p><strong>${letter.companyName}</strong></p>
                    ${letter.jobLocation ? `<p>${letter.jobLocation}</p>` : ''}
                </div>

                <div class="content">${letter.content}</div>

                <div class="signature">
                    <div class="sincerely">Sincerely,</div>
                    <div class="name">${letter.name || 'Applicant'}</div>
                </div>

                <div class="footer">
                    Generated by AI Cover Letter Generator • CareerTrack AI
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this cover letter?')) return;
        try {
            await axios.delete(`/api/cover-letter/${id}`);
            setLetters(prev => prev.filter(l => l._id !== id));
            if (activeLetter?._id === id) setActiveLetter(null);
            toast.success('Deleted 🗑️');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete');
        }
    };

    // ==================== RENDER ====================
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium mb-3 shadow-lg"
                >
                    <Sparkles size={16} /> AI Cover Letter Generator
                </motion.div>
                <h1 className="text-3xl font-bold text-slate-800">Create Your Personalized Cover Letter</h1>
                <p className="text-slate-500 text-sm mt-2">Fill in your details and AI will generate a professional cover letter</p>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={handleGenerate}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 mb-8 space-y-4 border border-slate-100"
            >
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                    <div className="relative  w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {form.photoUrl ? (
                            <img src={form.photoUrl} alt="profile" className="w-full  h-full object-cover" />
                        ) : (
                            <Camera size={22} className="text-slate-400" />
                        )}
                        {uploadingPhoto && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <Loader2 className="animate-spin" size={18} />
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Upload Profile Photo (Optional)
                        </button>
                        <p className="text-[11px] text-slate-400 mt-0.5">This photo will appear in PDF, Word & Print versions</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoSelect}
                        />
                        {form.photoUrl && (
                            <button
                                type="button"
                                onClick={() => handleChange('photoUrl', '')}
                                className="text-xs text-red-500 mt-1"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>

                {/* Basic Info */}
                <Section
                    id="basic"
                    title="Basic Information"
                    icon={<User size={16} />}
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            className={inputCls}
                            placeholder="Full Name"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Email Address"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Location (City, Country)"
                            value={form.location}
                            onChange={e => handleChange('location', e.target.value)}
                        />
                    </div>
                </Section>

                {/* Job Info */}
                <Section
                    id="job"
                    title="Job Information"
                    icon={<Briefcase size={16} />}
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            className={inputCls}
                            placeholder="Company Name *"
                            value={form.companyName}
                            onChange={e => handleChange('companyName', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Job Title *"
                            value={form.jobTitle}
                            onChange={e => handleChange('jobTitle', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Job Post URL (optional)"
                            value={form.jobPostUrl}
                            onChange={e => handleChange('jobPostUrl', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Job Location (optional)"
                            value={form.jobLocation}
                            onChange={e => handleChange('jobLocation', e.target.value)}
                        />
                    </div>
                </Section>

                {/* Education Section - Table View */}
                <Section
                    id="professional"
                    title="Education & Professional Info"
                    icon={<GraduationCap size={16} />}
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                >
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                            <GraduationCap size={15} className="text-indigo-600" />
                            Educational Qualifications <span className="text-red-500">*</span>
                            <span className="text-xs text-slate-400 font-normal">(Minimum 2 required)</span>
                        </label>
                        
                        {/* Table View for Education */}
                        <div className="overflow-x-auto bg-slate-50 rounded-lg border border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-slate-600 text-xs">Level</th>
                                        <th className="px-3 py-2 text-left font-semibold text-slate-600 text-xs">Institution</th>
                                        <th className="px-3 py-2 text-left font-semibold text-slate-600 text-xs">Field</th>
                                        <th className="px-3 py-2 text-left font-semibold text-slate-600 text-xs">Year</th>
                                        <th className="px-3 py-2 text-center font-semibold text-slate-600 text-xs w-10">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.educations.map((edu, idx) => (
                                        <tr key={edu.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="px-2 py-1.5">
                                                <input
                                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder={idx === 0 ? "HSC/SSC" : "Bachelor's"}
                                                    value={edu.level}
                                                    onChange={e => updateEducation(idx, 'level', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="Institution"
                                                    value={edu.institution}
                                                    onChange={e => updateEducation(idx, 'institution', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="Field"
                                                    value={edu.field}
                                                    onChange={e => updateEducation(idx, 'field', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="Year"
                                                    value={edu.year}
                                                    onChange={e => updateEducation(idx, 'year', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                {idx > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(idx)}
                                                        className="text-red-400 hover:text-red-600 text-xs font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <button
                            type="button"
                            onClick={addEducation}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                            <Plus size={14} /> Add Another Education
                        </button>
                    </div>

                    <input
                        className={inputCls}
                        placeholder="Technical Skills (e.g., React, Node.js, MongoDB...)"
                        value={form.skills}
                        onChange={e => handleChange('skills', e.target.value)}
                    />
                    <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="Work Experience (optional)"
                        value={form.experience}
                        onChange={e => handleChange('experience', e.target.value)}
                    />
                    <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="Projects & Portfolio Highlights"
                        value={form.projects}
                        onChange={e => handleChange('projects', e.target.value)}
                    />
                    <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="Certifications & Achievements (optional)"
                        value={form.certifications}
                        onChange={e => handleChange('certifications', e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            className={inputCls}
                            placeholder="GitHub URL"
                            value={form.github}
                            onChange={e => handleChange('github', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="Portfolio URL"
                            value={form.portfolio}
                            onChange={e => handleChange('portfolio', e.target.value)}
                        />
                        <input
                            className={inputCls}
                            placeholder="LinkedIn URL"
                            value={form.linkedin}
                            onChange={e => handleChange('linkedin', e.target.value)}
                        />
                    </div>
                </Section>

                {/* Cover Letter Options */}
                <Section
                    id="options"
                    title="Cover Letter Customization"
                    icon={<FileText size={16} />}
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                >
                    <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="Why are you interested in this role?"
                        value={form.whyJob}
                        onChange={e => handleChange('whyJob', e.target.value)}
                    />
                    <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="What makes you the ideal candidate?"
                        value={form.whyHire}
                        onChange={e => handleChange('whyHire', e.target.value)}
                    />
                    <textarea
                        className={inputCls}
                        rows={3}
                        placeholder="Job Description (paste here for a more tailored letter)"
                        value={form.jobDescription}
                        onChange={e => handleChange('jobDescription', e.target.value)}
                    />

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Writing Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {TONES.map(t => (
                                <motion.button
                                    key={t.key}
                                    type="button"
                                    onClick={() => handleChange('tone', t.key)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                                        form.tone === t.key
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                                    }`}
                                >
                                    {t.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </Section>

                <motion.button
                    type="submit"
                    disabled={generating}
                    whileHover={{ scale: generating ? 1 : 1.02 }}
                    whileTap={{ scale: generating ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition shadow-lg shadow-indigo-500/25"
                >
                    {generating ? (
                        <><Loader2 className="animate-spin" size={20} /> Generating...</>
                    ) : (
                        <><Sparkles size={20} /> Generate Cover Letter</>
                    )}
                </motion.button>
            </motion.form>

            {/* Active letter preview */}
            <AnimatePresence mode="wait">
                {activeLetter && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl mb-8 border-2 border-indigo-100 overflow-hidden"
                    >
                        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    {activeLetter.photoUrl && (
                                        <img src={activeLetter.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm" />
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">
                                            {activeLetter.jobTitle} — {activeLetter.companyName}
                                        </h3>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(activeLetter.createdAt).toLocaleString()}
                                            {activeLetter.edited && <span className="ml-2 text-amber-500">(edited)</span>}
                                            {activeLetter.regeneratedAt && <span className="ml-2 text-green-500">(regenerated)</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Toolbar */}
                            <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-slate-100">
                                <motion.button
                                    onClick={() => handleDownloadPDF(activeLetter)}
                                    disabled={exportingType === 'pdf'}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium shadow-sm shadow-indigo-200"
                                >
                                    {exportingType === 'pdf' ? <Loader2 className="animate-spin" size={15} /> : <Download size={15} />}
                                    Download PDF
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDownloadDOCX(activeLetter)}
                                    disabled={exportingType === 'docx'}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 text-sm font-medium"
                                >
                                    {exportingType === 'docx' ? <Loader2 className="animate-spin" size={15} /> : <FileText size={15} />}
                                    Download Word
                                </motion.button>
                                <motion.button
                                    onClick={() => handlePrint(activeLetter)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
                                >
                                    <Printer size={15} /> Print
                                </motion.button>
                                <motion.button
                                    onClick={handleRegenerate}
                                    disabled={regenerating}
                                    whileHover={{ scale: 1.03 }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
                                >
                                    {regenerating ? <Loader2 className="animate-spin" size={15} /> : <RefreshCw size={15} />}
                                    Regenerate
                                </motion.button>
                                {!isEditing ? (
                                    <motion.button
                                        onClick={startEditing}
                                        whileHover={{ scale: 1.03 }}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
                                    >
                                        <Edit3 size={15} /> Edit
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={handleSaveEdit}
                                        disabled={savingEdit}
                                        whileHover={{ scale: 1.03 }}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium"
                                    >
                                        {savingEdit ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save
                                    </motion.button>
                                )}
                                <motion.button
                                    onClick={() => handleCopy(activeLetter.content, activeLetter._id)}
                                    whileHover={{ scale: 1.03 }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
                                >
                                    {copiedId === activeLetter._id ? <Check size={15} /> : <Copy size={15} />} Copy
                                </motion.button>
                                <motion.button
                                    onClick={() => handleDelete(activeLetter._id)}
                                    whileHover={{ scale: 1.03 }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 text-sm font-medium ml-auto"
                                >
                                    <Trash2 size={15} /> Delete
                                </motion.button>
                            </div>

                            {isEditing ? (
                                <div>
                                    <textarea
                                        value={editedContent}
                                        onChange={e => setEditedContent(e.target.value)}
                                        rows={14}
                                        className="w-full border border-indigo-300 rounded-xl p-4 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                                            <X size={14} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-inner p-8 font-serif">
                                    {/* Professional Letterhead with Image on Right */}
                                    <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-slate-200 gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-2xl font-bold text-slate-800">{activeLetter.name || 'Applicant'}</h4>
                                            <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                                {activeLetter.email && (
                                                    <p className="flex items-center gap-1"><Mail size={12} /> {activeLetter.email}</p>
                                                )}
                                                {activeLetter.phone && (
                                                    <p className="flex items-center gap-1"><Phone size={12} /> {activeLetter.phone}</p>
                                                )}
                                                {activeLetter.location && (
                                                    <p className="flex items-center gap-1"><MapPin size={12} /> {activeLetter.location}</p>
                                                )}
                                            </div>
                                            {(activeLetter.github || activeLetter.portfolio || activeLetter.linkedin) && (
                                                <div className="text-xs text-indigo-600 mt-1 flex items-center gap-3 flex-wrap">
                                                    {activeLetter.portfolio && (
                                                        <a href={activeLetter.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                                            <Globe size={12} /> Portfolio
                                                        </a>
                                                    )}
                                                    {activeLetter.github && (
                                                        <a href={activeLetter.github} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                                            <FaGithub size={12} /> GitHub
                                                        </a>
                                                    )}
                                                    {activeLetter.linkedin && (
                                                        <a href={activeLetter.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                                            <FaLinkedin size={12} /> LinkedIn
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {activeLetter.photoUrl && (
                                            <img 
                                                src={activeLetter.photoUrl} 
                                                alt="Profile" 
                                                className="w-24 h-24 object-cover border-2 border-slate-200 flex-shrink-0 shadow-sm" 
                                                style={{ borderRadius: '4px' }}
                                            />
                                        )}
                                        <p className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(activeLetter.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>

                                    {/* Education Table in Preview */}
                                    {activeLetter.educations && activeLetter.educations.length > 0 && (
                                        <div className="mb-4 text-xs">
                                            <p className="font-semibold text-slate-600 mb-1">Education:</p>
                                            <table className="w-full border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-slate-50">
                                                        <th className="px-2 py-1 text-left border border-slate-200 font-semibold">Level</th>
                                                        <th className="px-2 py-1 text-left border border-slate-200 font-semibold">Institution</th>
                                                        <th className="px-2 py-1 text-left border border-slate-200 font-semibold">Field</th>
                                                        <th className="px-2 py-1 text-left border border-slate-200 font-semibold">Year</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {activeLetter.educations.map((edu, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-2 py-1 border border-slate-200">{edu.level || '-'}</td>
                                                            <td className="px-2 py-1 border border-slate-200">{edu.institution || '-'}</td>
                                                            <td className="px-2 py-1 border border-slate-200">{edu.field || '-'}</td>
                                                            <td className="px-2 py-1 border border-slate-200">{edu.year || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Recipient */}
                                    <div className="text-sm text-slate-700 mb-5">
                                        <p>Hiring Manager</p>
                                        <p className="font-semibold">{activeLetter.companyName}</p>
                                        {activeLetter.jobLocation && <p>{activeLetter.jobLocation}</p>}
                                    </div>

                                    {/* Body */}
                                    <div className="text-slate-700 whitespace-pre-line leading-relaxed text-sm">
                                        {activeLetter.content}
                                    </div>

                                    {/* Signature */}
                                    <div className="mt-6 pt-4 border-t border-slate-200">
                                        <p className="text-slate-500 text-sm italic">Sincerely,</p>
                                        <p className="font-bold text-slate-800 mt-1">{activeLetter.name || 'Applicant'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History */}
            <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                    <Clock size={20} className="text-indigo-600" /> History
                    {letters.length > 0 && (
                        <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {letters.length}
                        </span>
                    )}
                </h3>

                <CoverLetterHistory
                    letters={letters}
                    loading={loadingHistory}
                    onSelect={handleSelectLetter}
                    onDelete={handleDelete}
                    activeLetterId={activeLetter?._id}
                />
            </div>
        </div>
    );
};

export default CreateCoverLetter;
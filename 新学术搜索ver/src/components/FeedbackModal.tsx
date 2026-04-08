import React, { useState, useRef } from 'react';
import { X, ImagePlus, Trash2, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { isValidEmail } from '../utils/email';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const feedbackCategories = [
  { id: 'feature', label: '功能建议', labelEn: 'Feature Request' },
  { id: 'bug', label: 'Bug 反馈', labelEn: 'Bug Report' },
  { id: 'experience', label: '体验问题', labelEn: 'UX Issue' },
  { id: 'other', label: '其他', labelEn: 'Other' },
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('feature');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      if (uploadedImages.length >= 3) return;
      const url = URL.createObjectURL(file);
      setUploadedImages((prev) => [
        ...prev,
        { id: `${Date.now()}-${file.name}`, name: file.name, url },
      ]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = () => {
    if (!feedbackContent.trim()) return;
    if (contactEmail.trim() && !isValidEmail(contactEmail)) {
      setEmailError(isZh ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 1800);
    }, 1000);
  };

  const handleClose = () => {
    setSelectedCategory('feature');
    setFeedbackContent('');
    setContactEmail('');
    setEmailError('');
    setUploadedImages([]);
    setIsSubmitting(false);
    setSubmitted(false);
    onClose();
  };

  const isZh = language === 'zh';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-gray-900">
            {isZh ? '反馈' : 'Feedback'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-900">
              {isZh ? '感谢您的反馈！' : 'Thank you for your feedback!'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isZh ? '我们会尽快处理您的建议' : 'We will review your suggestion shortly'}
            </p>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isZh ? '反馈类型' : 'Feedback Type'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isZh ? cat.label : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Content */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isZh ? '详细描述' : 'Description'}
                </label>
                <textarea
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder={isZh ? '请描述您遇到的问题或建议...' : 'Describe the issue or your suggestion...'}
                  className="w-full h-32 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isZh ? '截图（可选，最多 3 张）' : 'Screenshots (optional, max 3)'}
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 3 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-300 transition-colors"
                    >
                      <ImagePlus className="w-5 h-5" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {isZh ? '联系邮箱（可选）' : 'Contact Email (optional)'}
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    const nextEmail = e.target.value;
                    setContactEmail(nextEmail);
                    if (!nextEmail.trim() || isValidEmail(nextEmail)) {
                      setEmailError('');
                    }
                  }}
                  onBlur={() => {
                    if (contactEmail.trim() && !isValidEmail(contactEmail)) {
                      setEmailError(isZh ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
                    }
                  }}
                  placeholder={isZh ? '方便我们与您联系' : 'So we can follow up with you'}
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    emailError
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-300'
                      : 'border-gray-200 focus:ring-gray-900/10 focus:border-gray-300'
                  }`}
                />
                {emailError ? <p className="mt-2 text-xs text-red-500">{emailError}</p> : null}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!feedbackContent.trim() || isSubmitting || !!emailError}
                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isZh ? '提交反馈' : 'Submit'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

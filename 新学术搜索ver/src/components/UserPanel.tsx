import React, { useState, useRef, useEffect } from 'react';
import { Globe, Bell, Settings, Gift, ArrowRight, Users, User, Download, LogOut, ChevronRight, Mail, Coins, HelpCircle, Crown, UserPlus, MessageSquare, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeedbackModal } from './FeedbackModal';

interface UserPanelProps {
  onOpenInvite?: () => void;
  onOpenPaywall?: () => void;
  onOpenRecharge?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  isCollapsed?: boolean;
}

export function UserPanel({ onOpenInvite, onOpenPaywall, onOpenRecharge, onOpenNotifications, onOpenSettings, isCollapsed = false }: UserPanelProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showInviteBanner, setShowInviteBanner] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenNotifications) {
      onOpenNotifications();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout logic here
    setShowUserMenu(false);
  };

  const handleDownloadClient = () => {
    console.log('Download client clicked');
    // Implement download client logic here
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    }
    setShowUserMenu(false);
  };

  const handleCreditsHistory = () => {
    console.log('Credits history clicked');
    // Implement credits history logic here
    setShowUserMenu(false);
  };

  return (
    <div className="border-t border-gray-100">
      {/* Invite Banner */}
      {showInviteBanner && !isCollapsed && (
        <div className="mx-3 mt-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg relative">
          <button
            onClick={() => setShowInviteBanner(false)}
            className="absolute top-2 right-2 p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2 mb-2">
            <Gift className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-0.5">{t('invite.title')}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t('invite.description')}</p>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-black hover:bg-gray-900 text-white text-xs font-medium rounded transition-colors"
            onClick={onOpenInvite}
          >
            <span>{t('invite.action')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* User Profile & Actions */}
      <div className={`${isCollapsed ? 'px-1.5' : 'px-3'} py-3 relative`} ref={menuRef}>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`${isCollapsed ? 'w-10 h-10 justify-center' : 'flex-1'} flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1.5 transition-colors`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              用
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-gray-900 truncate">添孬孬佛佛会员</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
              </>
            )}
          </button>
          
          {/* Notification Icon */}
          {!isCollapsed && (
            <button
              onClick={handleNotificationClick}
              className="relative p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
              title={t('notifications.title')}
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          )}
        </div>
        
        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className={`absolute bottom-full ${isCollapsed ? 'left-0 right-auto w-56' : 'left-3 right-3'} mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50`}>
            {/* User Info Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  用
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">添孬孬佛佛会员</div>
                  <div className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    user@fudan.edu.cn
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* Membership Info Card */}
              <div className="mx-3 mt-2 mb-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">{t('subscription.free')}</span>
                  <button className="text-xs text-gray-900 hover:text-black font-medium" onClick={() => { if (onOpenPaywall) onOpenPaywall(); setShowUserMenu(false); }}>{t('subscription.upgrade')}</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">900</span>
                    <span className="text-xs text-gray-500 ml-0.5">{t('credits')}</span>
                  </div>
                  <button 
                    onClick={() => { if (onOpenRecharge) onOpenRecharge(); setShowUserMenu(false); }}
                    className="text-xs text-gray-900 hover:text-black font-medium"
                  >
                    {t('recharge')}
                  </button>
                </div>
              </div>

              {/* Invite */}
              <button 
                onClick={() => {
                  if (onOpenInvite) onOpenInvite();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('user.invite')}</span>
              </button>

              {/* Settings */}
              <button 
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>{t('user.settings')}</span>
              </button>

              {/* Feedback */}
              <button 
                onClick={() => {
                  console.log('Feedback clicked');
                  setShowUserMenu(false);
                  setShowFeedbackModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('user.feedback')}</span>
              </button>

              {/* Language Settings */}
              <div className="px-3 py-2 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-2">{t('user.languageSettings')}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage('zh');
                      setShowUserMenu(false);
                    }}
                    className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      language === 'zh' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    简体中文
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowUserMenu(false);
                    }}
                    className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      language === 'en' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('user.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/app/context/AuthContext';
import { LogOut, User, Crown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import PaddlePaymentModal from './PaddlePaymentModal';

export default function Header() {
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const handleLoginClick = () => {
    window.location.href = '/api/auth/google';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      calculatePosition();
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  if (isLoading) {
    return null;
  }

  const dropdownContent = (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl min-w-[240px] pointer-events-auto"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`,
        zIndex: 99999,
      }}
    >
      <div className="p-4 border-b border-zinc-700">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Profile</p>
        <p className="text-sm font-medium text-white mt-2">{user?.name || user?.email}</p>
        <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
        <p className={`text-xs mt-2 font-medium uppercase tracking-wide ${
          user?.tier === 'pro' ? 'text-purple-400' : 'text-cyan-400'
        }`}>
          {user?.tier === 'pro' ? '👑 Pro Tier' : 'Free Tier'}
        </p>
      </div>

      {user?.tier === 'free' && (
        <button
          onClick={() => {
            setShowPaymentModal(true);
            setIsDropdownOpen(false);
          }}
          className="w-full px-4 py-3 text-left text-sm text-purple-400 hover:bg-purple-900/20 transition-colors flex items-center gap-2 pointer-events-auto border-b border-zinc-700"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </button>
      )}

      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2 pointer-events-auto"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );

  return (
    <div className="fixed top-0 right-0 z-50 pr-4 sm:pr-8 pt-4 sm:pt-6 flex items-center gap-3">
      <LanguageSwitcher />
      {!isAuthenticated ? (
        <button
          onClick={handleLoginClick}
          className="relative inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 pointer-events-auto"
        >
          🔐 구글로 1초 만에 시작하기
        </button>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 overflow-hidden pointer-events-auto group"
          aria-label="User menu"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || 'User'}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
      )}

      {isMounted && isDropdownOpen && isAuthenticated && createPortal(dropdownContent, document.body)}
      {showPaymentModal && (
        <PaddlePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          language="en"
        />
      )}
    </div>
  );
}

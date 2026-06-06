import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';

const ShareButton = ({ title, description, url, mediaType = 'movie', itemId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Construct share URL (use current page URL or construct from item)
  const shareUrl = url || window.location.href;
  const shareTitle = title || 'CineStream';
  const shareDescription = description || `Check out this ${mediaType} on CineStream!`;

  // Native share (works on mobile and modern browsers)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Native share failed:', err);
        }
      }
    } else {
      // Fallback: show dropdown
      setShowDropdown(!showDropdown);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowDropdown(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share to social platforms
  const shareToPlatform = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDesc = encodeURIComponent(shareDescription);

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDesc}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedTitle}%20${encodedDesc}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank', 'width=600,height=400');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="border border-gray-400 hover:border-white text-white rounded-full p-1.5 flex items-center justify-center transition hover:bg-white/10 hover:scale-105"
        aria-label="Share"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>

      {/* Share Dropdown (for browsers without native share) */}
      {showDropdown && (
        <>
          {/* Backdrop to close */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-brand-darkGray border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Share this {mediaType}
              </p>
            </div>

            <div className="p-2 space-y-1">
              {/* Social Platforms */}
              <button
                onClick={() => shareToPlatform('twitter')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                Share on Twitter
              </button>

              <button
                onClick={() => shareToPlatform('facebook')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Share on Facebook
              </button>

              <button
                onClick={() => shareToPlatform('linkedin')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition"
              >
                <Linkedin className="w-4 h-4 text-blue-500" />
                Share on LinkedIn
              </button>

              <button
                onClick={() => shareToPlatform('whatsapp')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                Share on WhatsApp
              </button>

              {/* Divider */}
              <div className="border-t border-white/10 my-2" />

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy link
                  </>
                )}
              </button>
            </div>

            {/* Preview */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <p className="text-[10px] text-gray-500 truncate">
                {shareUrl}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
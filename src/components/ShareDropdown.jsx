import React, { useState, useEffect, useRef } from 'react';
import {
  FaFacebookF,
  FaLine,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6'; // Threads 需用新版圖標

const ShareDropdown = ({ shareUrl, shareText }) => {
  const [open, setOpen] = useState(false);
  const [showIGModal, setShowIGModal] = useState(false);
  const dropdownRef = useRef(null);

  const encodedUrl = encodeURIComponent(shareUrl);
  const messageText = `${shareText}\n${shareUrl}`;
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const lineText = messageText.replace(/\n/g, '%0A');
  const lineShareUrl = isMobile
    ? `https://line.me/R/share?text=${lineText}`
    : `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;

  // 用 SDK 呼叫 FB 分享
  const handleFacebookShare = () => {
    if (window.FB) {
      window.FB.ui(
        {
          method: 'share',
          href: shareUrl,
		  display: 'popup',    // 加這行避免跳轉頁面
          quote: shareText,
        },
        (response) => {
          console.log('Facebook 分享結果', response);
        }
      );
    } else {
      alert('Facebook SDK 尚未載入');
    }
    setOpen(false);
  };

  const handleTwitterShare = () => {
    const twitterMessage = `${shareText}\n${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`;
    window.open(twitterUrl, '_blank');
    setOpen(false);
  };

  const handleThreadsShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("已複製分享內容，即將前往 Threads，請貼上後發文");
      window.open('https://www.threads.net/', '_blank');
    } catch (err) {
      alert("複製失敗，請手動貼上內容：\n" + `${shareText}\n${shareUrl}`);
    } finally {
      setOpen(false);
    }
  };
  const handleIGShare = () => {
    navigator.clipboard.writeText(messageText);
    setShowIGModal(true);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div ref={dropdownRef} className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
        >
          🔗 分享
        </button>

        {open && (
          <div className="mt-2 w-64 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2 space-y-1">
            <button
              onClick={handleFacebookShare}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg w-full text-left"
            >
              <FaFacebookF /> 分享到 Facebook
            </button>

            <a
              href={lineShareUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg"
            >
              <FaLine /> 分享到 LINE
            </a>

            <button
              onClick={handleTwitterShare}
              className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:bg-blue-50 rounded-lg w-full text-left"
            >
              <FaTwitter /> 分享到 Twitter
            </button>

            <button
              onClick={handleThreadsShare}
              className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 rounded-lg w-full text-left"
            >
              <FaThreads /> 分享到 Threads
            </button>

            <button
              onClick={handleIGShare}
              className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg w-full text-left"
            >
              <FaInstagram /> 分享到 Instagram
            </button>
          </div>
        )}
      </div>

      {showIGModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Instagram 分享說明</h2>
            <p className="mb-4 text-gray-700">分享文字已自動複製，請長按下方圖片儲存，然後到 Instagram 發文。</p>
            <img src="/images/share.jpg" alt="分享圖片" className="w-full rounded-lg mb-4" />
            <button
              onClick={() => setShowIGModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareDropdown;

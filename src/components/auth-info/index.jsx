'use client';

import { useDispatch, useSelector } from 'react-redux';
import { getLogin, getUser } from '@/redux/auth/auth-selectors';
import { logout } from '@/redux/auth/auth-operations';
import Text from '@/components/shared/text/text';
import { CiPower } from 'react-icons/ci';

const MAX_CHARS = 11;

function truncName(name = '', max = MAX_CHARS) {
  if (!name) return '';
  try {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      const parts = Array.from(seg.segment(name), s => s.segment);
      const cut = parts.slice(0, max).join('');
      return parts.length > max ? cut + '…' : name;
    }
  } catch {}
  const parts = Array.from(name);
  const cut = parts.slice(0, max).join('');
  return parts.length > max ? cut + '…' : name;
}

export default function AuthInfo() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getLogin);
  const user = useSelector(getUser);

  if (!isLoggedIn) return null;

  const name = user?.username || 'there';
  const displayName = truncName(name, 7);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center gap-[10px]">
      {user?.userAvatar ? (
        <img
          src={user.userAvatar}
          alt="User avatar"
          className="h-8 w-8 rounded-full object-cover border border-[rgba(0,0,0,0.1)]"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-[var(--accent1)] text-white flex items-center justify-center text-sm">
          {String(displayName).charAt(0).toUpperCase()}
        </div>
      )}
      <Text
        type="tiny"
        as="p"
        fontWeight="normal"
        className="text-[var(--text-main)]"
      >
        Hi, {displayName}
      </Text>
      <span className="h-5 w-px bg-[var(--accent1)]" />
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center justify-center rounded-full text-[var(--accent2)] hover:text-[var(--accent1)] hover:bg-black/[0.02] focus:outline-none transition"
        aria-label="Log out"
        title="Log out"
      >
        <CiPower size={22} />
      </button>
    </div>
  );
}

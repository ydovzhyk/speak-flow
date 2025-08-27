'use client';

import { useDispatch, useSelector } from 'react-redux';
import { getLogin, getUser } from '@/redux/auth/auth-selectors';
import { logout } from '@/redux/auth/auth-operations';
import Text from '@/components/shared/text/text';
import { FiLogOut } from 'react-icons/fi';

export default function AuthInfo() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getLogin);
  const user = useSelector(getUser);

  if (!isLoggedIn) return null;

  const name = user?.username || 'there';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center gap-[10px]">
      {/* Avatar (optional) */}
      {user?.userAvatar ? (
        <img
          src={user.userAvatar}
          alt="User avatar"
          className="h-8 w-8 rounded-full object-cover border border-[rgba(0,0,0,0.1)]"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-[var(--accent1)] text-white flex items-center justify-center text-sm">
          {String(name).charAt(0).toUpperCase()}
        </div>
      )}

      {/* Greeting */}
      <Text
        type="tiny"
        as="p"
        fontWeight="normal"
        className="text-[var(--text-main)]"
      >
        Hi, {name}
      </Text>

      {/* Divider */}
      <span className="h-5 w-px bg-[rgba(0,0,0,0.45)]" />

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-1 text-sm text-[var(--accent2)] hover:text-[var(--accent1)] transition-colors"
        aria-label="Log out"
        title="Log out"
      >
        <FiLogOut className="text-base" />
      </button>
    </div>
  );
}

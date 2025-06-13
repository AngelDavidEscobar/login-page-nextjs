'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (

    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      onClick={() => signOut({ callbackUrl: '/auth/login' })}>
      <LogOut className="w-5 h-5" />
    </button>
    
  );
}

/**
 * サイドバー
 *
 * Top,Settings,Logoutを表示する
 *
 * @package Frontend
 * @module SideBar
 * @since 1.0.0
 */
'use client';

import Link from 'next/link';
import { IoSettingsOutline } from 'react-icons/io5';
import { VscSignOut } from 'react-icons/vsc';
import { IoHomeOutline } from 'react-icons/io5';

export default function SideBar() {
  return (
    <div className="flex h-full w-40 flex-col bg-white">
      <div className="flex-1 pl-5 pr-5 pt-8">
        <nav className="space-y-2">
          <Link href="/" className="flex items-center px-4 py-2 hover:bg-gray-200">
            <IoHomeOutline className="mr-2 text-xl" />
            <span>Home</span>
          </Link>
          {/* 将来的に追加されるボタンはここに配置 */}
        </nav>
      </div>
      <div className="border-t border-gray-200 p-4">
        <nav className="space-y-2">
          <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-200">
            <IoSettingsOutline className="mr-2 text-xl" />
            <span>Settings</span>
          </Link>
          <Link href="/login" className="flex items-center px-4 py-2 hover:bg-gray-200">
            <VscSignOut className="mr-2 text-xl" />
            <span>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

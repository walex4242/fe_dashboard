"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="bg-white ">
            {/* Top Section with Logo and Navigation */}
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="ml-3">
                    <Link href="/">
                        <div className="relative w-[60px] h-[60px] ">
                            <Image
                                src='/Focus.png'
                                alt='logo'
                                fill
                                style={{ objectFit: 'contain' }} // Use style for object fit
                                priority={false}
                                className='rounded-lg'
                            />
                        </div>
                    </Link>
                </div>

                {/* Centered Welcome Message */}
                <div className="text-center py-4 bg-white">
                    <h1 className="text-2xl md:text-3xl font-semibold text-black">
                        Welcome to Focus Elite Community
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6  mr-3">
                    <button onClick={() => router.push('/')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black">
                        Home
                    </button>
                    <button onClick={() => router.push('/about')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black">
                        About
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-800 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav className="md:hidden px-4 pb-4">
                    <Link href="/" className="block py-2 text-gray-800 hover:text-blue-600">
                        Home
                    </Link>
                    <Link href="/about" className="block py-2 text-gray-800 hover:text-blue-600">
                        About
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;

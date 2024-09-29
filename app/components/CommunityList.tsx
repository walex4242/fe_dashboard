"use client";

import { useEffect, useState } from 'react';
import CreateCommunity from '../components/CreateCommunity';
import Link from 'next/link';
import Image from 'next/image';

interface Community {
    _id: string;            // Community ID
    name: string;           // Community name
}

const CommunityList = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editCommunity, setEditCommunity] = useState<Community | null>(null); // For editing

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community`);
                if (!res.ok) throw new Error('Failed to fetch communities');
                const data = await res.json();
                setCommunities(data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    const handleCreateCommunity = async (name: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error('Failed to create community');
            const newCommunity = await res.json();
            setCommunities([...communities, newCommunity]);
            setShowModal(false);
        } catch (error: any) {
            console.error('Error creating community:', error);
        }
    };

    const handleEditCommunity = async (id: string, name: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error('Failed to update community');
            const updatedCommunity = await res.json();
            setCommunities(communities.map(c => (c._id === id ? updatedCommunity : c)));
            setEditCommunity(null);
            setShowModal(false);
        } catch (error: any) {
            console.error('Error editing community:', error);
        }
    };

    const handleDeleteCommunity = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/${id}`, {
                method: 'DELETE',
            });

            setCommunities(communities.filter(c => c._id !== id));
        } catch (error: any) {
            console.error('Error deleting community:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto">
            {/* <h1 className="text-2xl font-bold text-center my-4">Communities</h1> */}

            <div className="text-right mb-4">
                <button
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black mr-3"
                    onClick={() => setShowModal(true)}
                >
                    Create Community
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
                {communities.map((community) => (
                    <div key={community._id} className="border p-4 rounded shadow text-center hover:bg-gray-100">
                        <Link href={`/community/${community._id}`} className="text-lg font-bold text-gray-500 hover:text-black ">
                            <div>
                                {community.name}
                            </div>
                        </Link>
                        <div className="flex justify-between mt-2">
                            <button onClick={() => {
                                setEditCommunity(community);
                                setShowModal(true);
                            }}>
                                <Image src='/edit.svg' alt="Edit" className="w-6 h-6" width={20} height={20} />
                            </button>
                            <button onClick={() => handleDeleteCommunity(community._id)}>
                                <Image src='/delete.svg' alt="Delete" className="w-7 h-7" width={20} height={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Creating/Editing Community */}
            {showModal && (
                <CreateCommunity
                    communityName={editCommunity?.name || ''}
                    onSubmit={(name) =>
                        editCommunity
                            ? handleEditCommunity(editCommunity._id, name)
                            : handleCreateCommunity(name)
                    }
                    onClose={() => {
                        setShowModal(false);
                        setEditCommunity(null);
                    }}
                />
            )}
        </div>
    );
};

export default CommunityList;

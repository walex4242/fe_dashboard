"use client";

import { useRouter } from 'next/navigation';
import LevelSelector from '../../components/LevelSelector';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CommunityPage = ({ params }: { params: { id: string } }) => {
    const { id } = params; // Extract the community ID from params
    const [communityName, setCommunityName] = useState<string | null>(null);
    const [levelIds, setLevelIds] = useState<{ _id: string }[]>([]); // Expecting level IDs as objects
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCommunityData = async () => {
            if (!id) {
                setError("Community ID is undefined");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/${id}`); // Use template literals for the URL
                if (!res.ok) throw new Error('Failed to fetch community data');

                const communityData = await res.json();
                console.log('Community Data:', communityData);
                setCommunityName(communityData.name);

                // Assuming communityData.levels is an array of level objects
                setLevelIds((communityData.levels || []).map((level: { _id: string }) => ({ _id: level._id })));

                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCommunityData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-center my-4">{communityName}</h1>
            <p className="text-center flex-1">Select Level :</p>
            <LevelSelector levelIds={levelIds} communityId={id} />
        </div>
    );
};

export default CommunityPage;

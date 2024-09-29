"use client"
import { useEffect, useState } from 'react';
import CategorySelector from '../../../../components/CategorySelector';

const LevelPage = ({ params }: { params: { id: string; levelId: string } }) => {
    const [communityName, setCommunityName] = useState<string | null>(null);
    const [levelName, setLevelName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNames = async () => {
            try {
                // Fetch community name
                const communityRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/${params.id}`);
                if (!communityRes.ok) throw new Error('Failed to fetch community');
                const communityData = await communityRes.json();
                setCommunityName(communityData.name);

                // Fetch level name
                const levelRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/level/${params.levelId}`);
                if (!levelRes.ok) throw new Error('Failed to fetch level');
                const levelData = await levelRes.json();
                setLevelName(levelData.name);

                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchNames();
    }, [params.id, params.levelId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-center my-2">
                {communityName} Community 
            </h1>
            <h2 className='text-xl font-semibold text-center my-4'>{levelName} Level</h2>
            <CategorySelector community={params.id} level={params.levelId} />
        </div>
    );
};

export default LevelPage;

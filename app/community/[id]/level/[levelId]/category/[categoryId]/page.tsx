"use client";
import React, { useEffect, useState } from 'react';
import QuestionSelector from '../../../../../../components/QuestionSelector';
import Modal from '../../../../../../components/QuestionModal';

// Define the Question type
interface Question {
    _id: string;
    text: string;
}

const CategoryPage = ({ params }: { params: { id: string; levelId: string; categoryId: string } }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/question/${params.id}/${params.levelId}/${params.categoryId}`);
                if (!response.ok) {
                    console.error('Fetch failed with status:', response.status, 'and status text:', response.statusText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const questionsData: Question[] = await response.json();
                setQuestions(questionsData);
            } catch (error: any) {
                console.error('Failed to fetch questions:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [params.id, params.levelId, params.categoryId]);

    const handleCreateQuestion = async (questionText: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/question/${params.id}/${params.levelId}/${params.categoryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: questionText }),
        });
        if (response.ok) {
            const newQuestion: Question = await response.json();
            setQuestions((prev) => [...prev, newQuestion]);
        } else {
            console.error('Failed to create question:', response.statusText);
        }
    };

    const handleEditQuestion = (questionId: string) => {
        const questionToEdit = questions.find((q) => q._id === questionId);
        if (questionToEdit) {
            setEditingQuestionId(questionId);
            setIsModalOpen(true);
        }
    };

    const handleUpdateQuestion = async (questionText: string) => {
        try {
            if (!editingQuestionId) {
                throw new Error('No question ID provided for update');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/question/${params.id}/${params.levelId}/${params.categoryId}/${editingQuestionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: questionText }), // Only send text, other ids are set in the backend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update question: ${errorData.message || 'Unknown error'}`);
            }

            const updatedQuestion: Question = await response.json();
            setQuestions((prev) => prev.map((q) => (q._id === editingQuestionId ? updatedQuestion : q)));
        } catch (error: any) {
            console.error('Error while updating question:', error);
            alert(error.message);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/question/${questionId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setQuestions(prev => prev.filter(q => q._id !== questionId));
        } else {
            console.error('Failed to delete question:', response.statusText);
        }
    };

    const openModal = () => {
        setEditingQuestionId(null); // Reset for new question
        setIsModalOpen(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-center my-8">Questions</h1>

            {/* Buttons below the title */}
            <div className="flex justify-between mb-4">
                <div>
                    <button onClick={() => window.history.back()} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black ml-3">
                        Back
                    </button>
                    <button onClick={() => window.location.href = '/'} className="bg-gray-700 text-white px-4 py-2 rounded ml-2 hover:bg-black">
                        Home
                    </button>
                </div>
                <button onClick={openModal} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black mr-3">
                    Create Question
                </button>
            </div>

            <QuestionSelector
                questions={questions}
                communityId={params.id}
                levelId={params.levelId}
                categoryId={params.categoryId}
                onEditQuestion={handleEditQuestion}
                onDeleteQuestion={handleDeleteQuestion}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingQuestionId ? handleUpdateQuestion : handleCreateQuestion}
                initialText={editingQuestionId ? questions.find((q) => q._id === editingQuestionId)?.text : undefined}
            />
        </div>
    );
};

export default CategoryPage;

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Question {
    _id: string;
    text: string;
}

interface QuestionSelectorProps {
    questions: Question[];
    communityId: string;
    levelId: string;
    categoryId: string;
    onEditQuestion: (questionId: string) => void;
    onDeleteQuestion: (questionId: string) => void; // Add this prop
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
    questions,
    communityId,
    levelId,
    categoryId,
    onEditQuestion,
    onDeleteQuestion,
}) => {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null); // To track loading state

    const handleQuestionClick = (questionId: string) => {
        router.push(`/community/${communityId}/level/${levelId}/category/${categoryId}/question/${questionId}`);
    };

    const handleDelete = (questionId: string) => {
        if (confirm("Are you sure you want to delete this question?")) {
            setLoadingId(questionId); // Set loading state for the specific question
            onDeleteQuestion(questionId);
        }
    };

    return (
        <div>
            <ul className="list-none p-4">
                {questions.map((question) => (
                    <li key={question._id} className="mb-4 flex flex-col border-b pb-2">
                        <p
                            className="cursor-pointer text-lg hover:text-blue-600"
                            onClick={() => onEditQuestion(question._id)}
                        >
                            {question.text}
                        </p>
                        <div className="flex justify-between mt-2">
                            <button
                                onClick={() => onEditQuestion(question._id)}
                                className="transition hover:scale-105"
                                aria-label={`Edit question ${question.text}`}
                            >
                                <Image src='/edit.svg' alt="Edit" className="w-6 h-6" width={20} height={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(question._id)} // Call delete on click
                                className="transition hover:scale-105"
                                aria-label={`Delete question ${question.text}`}
                                disabled={loadingId === question._id} // Disable if loading
                            >
                                <Image src='/delete.svg' alt="Delete" className="w-7 h-7" width={20} height={20} />
                            </button>
                        </div>
                        {loadingId === question._id && (
                            <p className="text-sm text-gray-500">Deleting...</p> // Show loading state
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionSelector;

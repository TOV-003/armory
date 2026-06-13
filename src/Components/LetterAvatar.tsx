import React from 'react';

interface LetterAvatarProps {
    letter?: string;
    size?: string;
    bgColor?: string;
    textColor?: string;
    className?: string;
}

const LetterAvatar: React.FC<LetterAvatarProps> = ({
    letter,
    size = 'w-10 h-10',
    bgColor = 'bg-gray-400',
    textColor = 'text-white',
    className = '',
}) => {
    const displayLetter = letter && letter.length > 0 ? letter.charAt(0).toUpperCase() : '?';

    return (
        <div
            className={`
                ${size} ${bgColor} ${textColor}
                rounded-full flex items-center justify-center
                font-semibold text-xl select-none 
                ${className}
            `}
        >
            {displayLetter}
        </div>
    );
};

export default LetterAvatar;
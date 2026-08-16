import React from 'react';
import { PieceType, PieceColor } from '@/types/chess';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

export const ChessPieceIcon: React.FC<PieceProps> = ({ type, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';

  // SVG color palette
  const fill = isWhite ? '#ffffff' : '#1e293b';
  const stroke = isWhite ? '#27272a' : '#09090b';
  const highlight = isWhite ? '#f8fafc' : '#334155';
  const innerDetail = isWhite ? '#09090b' : '#f8fafc';

  switch (type.toLowerCase()) {
    case 'k': // King
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fillRule="evenodd" clipRule="evenodd">
            {/* Base */}
            <path
              d="M22.5 11.63V6M20 8h5"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.5 25c0 0 4.5-7.5 3-10.5-1.5-3-6-3-6 0-1.5 3 3 10.5 3 10.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
              stroke={stroke}
              strokeWidth="1.5"
            />
            {/* Head cross details */}
            <circle cx="22.5" cy="14" r="1.5" fill={innerDetail} />
          </g>
        </svg>
      );

    case 'q': // Queen
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fillRule="evenodd" clipRule="evenodd">
            <path
              d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14l-7-11 2 12z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 26c0 2 1.5 2 2.5 4 2.5 4 1 5.5 1 5.5h20s-1.5-1.5 1-5.5c1-2 2.5-2 2.5-4 0-1.5-1.5-2.5-3-2-4.5 1-13 1-17.5 0-1.5-.5-3 .5-3 2z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3-1 18-1 21 0m-20.5 3.5c3-1 17-1 20 0"
              stroke={stroke}
              strokeWidth="1.5"
            />
            <circle cx="6" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="14" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="22.5" cy="8" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="31" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="39" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'r': // Rook
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fillRule="evenodd" clipRule="evenodd">
            <path
              d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm1.5-4.5l1.5-12.5h15l1.5 12.5H13.5zM11 19h23v-5h-4v2h-4v-2h-3v2h-4v-2h-4v2h-4v-2z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 35.5h21m-20-4h19m-17-12.5h15"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );

    case 'b': // Bishop
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fillRule="evenodd" clipRule="evenodd">
            <path
              d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M17.5 26h10M15 30h15m-7.5-14v5m-3-2.5h6"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );

    case 'n': // Knight — custom 3D artwork
      return (
        <img
          src={isWhite ? '/assets/pieces/white-knight.png' : '/assets/pieces/black-knight.png'}
          alt={`${isWhite ? 'White' : 'Black'} knight`}
          className={`${className} object-contain select-none`}
          draggable={false}
        />
      );

    case 'p': // Pawn
    default:
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fillRule="evenodd" clipRule="evenodd">
            <path
              d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M14 36c5-2 12-2 17 0m-16 3h15"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );
  }
};

import React, { ReactNode } from 'react';
import './Modal.scss';

interface ModalProps {
    isOpen: boolean;
    handleClose: () => void;
    content: ReactNode; // This is the type for content that can be anything renderable in React
}

const Modal: React.FC<ModalProps> = ({ isOpen, handleClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close" onClick={handleClose}>
                    &times;
                </button>
                <div className="modal-content">
                    {content} {/* Content is rendered here */}
                </div>
            </div>
        </div>
    );
};

export default Modal;

import './GlobalModal.scss';
import { motion as Motion, AnimatePresence } from 'framer-motion';

function GlobalModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <Motion.div
                className="global-modal"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div
                    className="global-modal__content"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </Motion.div>
        </AnimatePresence>
    );
}

export default GlobalModal;

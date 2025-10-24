import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';

interface HelpfulTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpfulTipsModal: React.FC<HelpfulTipsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        backdrop: 'bg-slate-900/50 backdrop-blur-sm',
        base: 'bg-white rounded-[calc(var(--scale-radius)*1.2)] shadow-[0_24px_70px_-22px_rgba(15,23,42,0.36)] max-w-[min(92vw,32rem)]',
        closeButton: 'bg-white/95 hover:bg-white border-2 border-slate-300 hover:border-slate-400 rounded-full shadow-lg text-slate-700 hover:text-slate-900 font-bold transition-all',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-[clamp(1.2rem,3vw,1.5rem)] font-bold text-slate-900">
          Helpful Tips
        </ModalHeader>
        <ModalBody className="pb-6">
          <ul className="list-inside space-y-3 text-[clamp(0.9rem,2.2vw,1.05rem)] text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use shorthand like <strong className="text-slate-900">30s</strong>, <strong className="text-slate-900">20m</strong>, or <strong className="text-slate-900">1h 15m</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Plain numbers still represent minutes (e.g., <strong className="text-slate-900">45</strong> = 45 minutes).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Minimum duration is 1 second; maximum is 24 hours.</span>
            </li>
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};


/**
 * Countdown Timer Application - Confirmation Modal Component
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: 'bg-slate-900/50 backdrop-blur-sm',
        base: 'bg-white rounded-[calc(var(--scale-radius)*1.2)] shadow-[0_24px_70px_-22px_rgba(15,23,42,0.36)] max-w-[min(92vw,28rem)]',
        closeButton: 'bg-white/95 hover:bg-white border-2 border-slate-300 hover:border-slate-400 rounded-full shadow-lg text-slate-700 hover:text-slate-900 font-bold transition-all',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-[clamp(1.1rem,2.8vw,1.4rem)] font-bold text-slate-900 px-[clamp(1.2rem,3.2vw,1.8rem)] pt-[clamp(1.2rem,3.2vw,1.8rem)] pb-0">
              {title}
            </ModalHeader>
            <ModalBody className="px-[clamp(1.2rem,3.2vw,1.8rem)] py-[clamp(1rem,2.8vw,1.4rem)]">
              <p className="text-[clamp(0.95rem,2.4vw,1.1rem)] text-slate-600 leading-relaxed">
                {message}
              </p>
            </ModalBody>
            <ModalFooter className="px-[clamp(1.2rem,3.2vw,1.8rem)] pb-[clamp(1.2rem,3.2vw,1.8rem)] pt-0 gap-[calc(var(--scale-gap)*0.4)]">
              <Button
                variant="bordered"
                onPress={onClose}
                className="min-h-[2.75rem] rounded-[calc(var(--scale-radius)*0.85)] border-2 border-slate-300 px-[clamp(1.2rem,3vw,1.8rem)] py-[clamp(0.55rem,1.6vw,0.85rem)] text-[clamp(0.9rem,2.2vw,1.05rem)] font-semibold text-slate-700 transition-colors hover:bg-slate-50 touch-manipulation"
              >
                {cancelText}
              </Button>
              <Button
                color={isDangerous ? 'danger' : 'primary'}
                onPress={handleConfirm}
                className={`min-h-[2.75rem] rounded-[calc(var(--scale-radius)*0.85)] px-[clamp(1.4rem,3.4vw,2rem)] py-[clamp(0.55rem,1.6vw,0.85rem)] text-[clamp(0.9rem,2.2vw,1.05rem)] font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] touch-manipulation ${
                  isDangerous
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800'
                }`}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};


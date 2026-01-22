import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default'
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {variant === 'destructive' ? (
            <>
              <AlertDialogCancel onClick={handleCancel}>{cancelLabel}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
                {actionLabel}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction onClick={handleConfirm} className="bg-find-red hover:bg-red-700">
              {actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MessageDialog;

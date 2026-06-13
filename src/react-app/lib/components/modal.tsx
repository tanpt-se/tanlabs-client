'use client';

import * as React from 'react';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogRoot,
  AlertDialogTitle,
} from './alert-dialog';
import { buttonVariants } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { cn } from './lib/cn';
import { Separator } from './separator';

export type AlertDialogWrapperProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  actionLabel?: React.ReactNode;
  closeLabel?: React.ReactNode;
  tone?: 'default' | 'danger';
  onCancel?: () => void;
  onAction?: () => void;
  actionDisabled?: boolean;
  open?: boolean;
};

export function AlertDialogWrapper({
  title,
  description,
  cancelLabel,
  actionLabel,
  closeLabel,
  tone = 'default',
  onCancel,
  onAction,
  actionDisabled,
  open = true,
}: AlertDialogWrapperProps) {
  void closeLabel;
  return (
    <AlertDialogRoot
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel?.();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          {title ? (
            <AlertDialogTitle>{title}</AlertDialogTitle>
          ) : (
            <AlertDialogTitle className="sr-only">
              {typeof cancelLabel === 'string' ? cancelLabel : 'Alert'}
            </AlertDialogTitle>
          )}
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelLabel ? (
            <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          ) : null}
          {actionLabel ? (
            <AlertDialogAction
              className={cn(tone === 'danger' ? buttonVariants({ variant: 'destructive' }) : '')}
              disabled={actionDisabled}
              onClick={onAction}
            >
              {actionLabel}
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}

export type ModalProps = {
  open?: boolean;
  onClose?: () => void;
  closeLabel?: React.ReactNode;
  panelClassName?: string;
  dismissible?: boolean;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  children?: React.ReactNode;
};

export function Modal({
  open = true,
  onClose,
  closeLabel,
  panelClassName,
  dismissible = true,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  children,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && dismissible) onClose?.();
      }}
    >
      <DialogContent
        className={panelClassName}
        closeLabel={closeLabel}
        showCloseButton={dismissible}
        onEscapeKeyDown={
          dismissible && closeOnEscape ? undefined : (event) => event.preventDefault()
        }
        onInteractOutside={
          dismissible && closeOnInteractOutside ? undefined : (event) => event.preventDefault()
        }
        onPointerDownOutside={
          dismissible && closeOnInteractOutside ? undefined : (event) => event.preventDefault()
        }
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export type ModalScaffoldProps = ModalProps & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
};

export function ModalScaffold({
  title,
  description,
  bodyClassName,
  footer,
  footerClassName,
  children,
  ...modalProps
}: ModalScaffoldProps) {
  const shouldRenderHeader = Boolean(title || description);
  const hiddenTitle = typeof modalProps.closeLabel === 'string' ? modalProps.closeLabel : 'Dialog';

  return (
    <Modal {...modalProps}>
      {shouldRenderHeader ? (
        <ModalHeader>
          <div className="space-y-2">
            {title ? (
              <ModalTitle>{title}</ModalTitle>
            ) : (
              <ModalTitle className="sr-only">{hiddenTitle}</ModalTitle>
            )}
            {description ? <ModalDescription>{description}</ModalDescription> : null}
            <Separator />
          </div>
        </ModalHeader>
      ) : (
        <ModalTitle className="sr-only">{hiddenTitle}</ModalTitle>
      )}
      <ModalBody className={cn('space-y-5', bodyClassName)}>{children}</ModalBody>
      {footer ? <ModalFooter className={cn('gap-3', footerClassName)}>{footer}</ModalFooter> : null}
    </Modal>
  );
}

export const ModalHeader = DialogHeader;

export function ModalBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="modal-body" className={cn('flex flex-col gap-4', className)} {...props} />;
}

export const ModalFooter = DialogFooter;
export const ModalTitle = DialogTitle;
export const ModalDescription = DialogDescription;

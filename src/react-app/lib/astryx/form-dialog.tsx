'use client';

import type { ReactNode } from 'react';

import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

export function FormDialog({
  children,
  dismissible = true,
  footer,
  isOpen,
  onOpenChange,
  purpose = 'form',
  subtitle,
  title,
  width = 480,
}: {
  children: ReactNode;
  dismissible?: boolean;
  footer?: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  purpose?: 'required' | 'form' | 'info';
  subtitle?: string;
  title: string;
  width?: number | string;
}) {
  const handleOpenChange = (open: boolean) => {
    if (!dismissible && !open) {
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      purpose={purpose}
      width={width}
    >
      <Layout
        header={
          <DialogHeader
            title={title}
            subtitle={subtitle}
            onOpenChange={dismissible ? handleOpenChange : undefined}
          />
        }
        content={<LayoutContent padding={4}>{children}</LayoutContent>}
        footer={footer ? <LayoutFooter padding={4}>{footer}</LayoutFooter> : undefined}
      />
    </Dialog>
  );
}

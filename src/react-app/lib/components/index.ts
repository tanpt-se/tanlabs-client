import type { ButtonHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes } from 'react';
import { cloneElement, createElement, isValidElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Bell,
  BookOpenText,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  MonitorSmartphone,
  Moon,
  RefreshCw,
  ShieldCheck,
  ShieldEllipsis,
  Sun,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';

import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from './typography';

export type { ColumnDef, Row, RowSelectionState } from '@tanstack/react-table';

export { Alert, AlertDescription, AlertTitle, alertVariants, type AlertProps } from './alert';
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Badge, badgeVariants, type BadgeProps } from './badge';
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
export { Button, buttonVariants, type ButtonProps } from './button';
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
export {
  DashboardOverview,
  type DashboardOverviewAction,
  type DashboardOverviewStat,
} from './dashboard-overview';
export { ComingSoon } from './coming-soon';
export { Checkbox } from './checkbox';
export {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from './combobox';
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';
export { Input } from './input';
export { Label } from './label';
export {
  AlertDialogWrapper as AlertDialog,
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalScaffold,
  ModalTitle,
  type AlertDialogWrapperProps as AlertDialogProps,
  type ModalProps,
  type ModalScaffoldProps,
} from './modal';
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { ScrollArea, ScrollBar } from './scroll-area';
export { Separator } from './separator';
export {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from './sheet';
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuEllipsis,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar';
export { Skeleton } from './skeleton';
export {
  pushToast,
  sonnerToast,
  Toaster,
  useToast,
  type ToastPayload,
  type ToastTone,
} from './sonner';
export { Spinner } from './spinner';
export { Switch } from './switch';
export {
  DataTable,
  TablePagination,
  Table,
  TABLE_PAGE_SIZE_OPTIONS,
  TableBody,
  TableCaption,
  TableCell,
  TableCellStack,
  TableFooter,
  TableHead,
  TableHeader,
  TableMeta,
  TableRow,
  TableShell,
  TableViewport,
  useTableSelection,
  type DataTablePagination,
  type DataTableProps,
  type DataTableSelection,
  type TablePaginationLabels,
  type TablePaginationProps,
  type UseTableSelectionOptions,
} from './table';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Textarea } from './textarea';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  TypographyTable,
} from './typography';

type AnyProps = Record<string, unknown> & { children?: ReactNode };

function stripUiOnlyProps(props: Record<string, unknown>) {
  const {
    asChild,
    isLoading,
    loading,
    tone,
    variant,
    size,
    align,
    side,
    sideOffset,
    inset,
    ...rest
  } = props;
  void asChild;
  void isLoading;
  void loading;
  void tone;
  void variant;
  void size;
  void align;
  void side;
  void sideOffset;
  void inset;
  return rest;
}

function asElement(tag: string) {
  return function ElementComponent(props: AnyProps) {
    const { children, ...rest } = props ?? {};
    return createElement(tag, stripUiOnlyProps(rest), children);
  };
}

function selectElement(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { children, className, ...rest } = props;
  const normalizedClassName = [
    'appearance-none border border-input bg-transparent rounded-md shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return createElement(
    'select',
    stripUiOnlyProps({
      ...(rest as Record<string, unknown>),
      className: normalizedClassName,
    }),
    children,
  );
}

export type AppIcon = ReactElement<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;
export type SidebarItemConfig = {
  key?: string;
  href?: string;
  label?: ReactNode;
  children?: SidebarItemConfig[];
  icon?: AppIcon;
  active?: boolean;
};

export type ShellBaseText = Record<string, unknown>;
export type PublicInfoPanelText = Record<string, unknown>;

export const CONTENT_VIEW_TRANSITION_NAME = 'content-view-transition';

export const icons: Record<string, AppIcon> = {
  arrowLeft: createElement(ArrowLeft),
  bell: createElement(Bell),
  bookOpenText: createElement(BookOpenText),
  eye: createElement(Eye),
  eyeOff: createElement(EyeOff),
  fileText: createElement(FileText),
  keyRound: createElement(KeyRound),
  lockKeyhole: createElement(LockKeyhole),
  mail: createElement(Mail),
  monitorSmartphone: createElement(MonitorSmartphone),
  moon: createElement(Moon),
  refreshCw: createElement(RefreshCw),
  shieldCheck: createElement(ShieldCheck),
  shieldEllipsis: createElement(ShieldEllipsis),
  sun: createElement(Sun),
  trash2: createElement(Trash2),
  userRound: createElement(UserRound),
  users: createElement(Users),
};

export const TopRouteProgress = function TopRouteProgress() {
  return createElement(
    'div',
    {
      'aria-hidden': true,
      className: 'pointer-events-none fixed inset-x-0 top-0 z-[9999] h-1 overflow-hidden',
    },
    createElement('div', { className: 'bg-primary/20 absolute inset-0' }),
    createElement('div', {
      className:
        'bg-primary absolute inset-y-0 -left-1/3 w-1/3 animate-[route-progress_1.2s_ease-in-out_infinite]',
    }),
  );
};

export const AppShellLoading = function AppShellLoading() {
  return createElement(
    'div',
    { className: 'relative min-h-screen' },
    createElement(TopRouteProgress),
  );
};
export const AuthPageLoading = asElement('div');
export const Body = TypographyP;
export const DashboardContentLoading = function DashboardContentLoading() {
  return createElement(
    'div',
    { className: 'relative min-h-[1px]' },
    createElement(TopRouteProgress),
  );
};
export const Eyebrow = TypographySmall;
export const Fine = TypographySmall;
export const Icon = function Icon(props: {
  icon?: AppIcon;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}) {
  if (!isValidElement(props.icon)) {
    return null;
  }

  return cloneElement(props.icon, {
    className: props.className,
    'aria-hidden': props['aria-hidden'],
  });
};
export const InlineLoadingIndicator = function InlineLoadingIndicator(props: {
  label?: ReactNode;
  className?: string;
}) {
  return createElement(
    'span',
    {
      className:
        props.className ??
        'text-muted-foreground inline-flex w-full items-center justify-center gap-2 text-sm',
      role: 'status',
      'aria-live': 'polite',
    },
    createElement(Loader2, { className: 'size-4 animate-spin', 'aria-hidden': true }),
    props.label ? createElement('span', null, props.label) : null,
  );
};
export const Meta = TypographyMuted;
export const PageTitle = TypographyH1;
export const PasswordVisibilityToggle = function PasswordVisibilityToggle(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    visible?: boolean;
    onShow?: () => void;
    onHide?: () => void;
  },
) {
  const { visible, onShow, onHide, onClick, type, children, ...rest } = props;

  return createElement(
    'button',
    {
      ...rest,
      type: type ?? 'button',
      'aria-label': visible ? 'Hide password' : 'Show password',
      'aria-pressed': visible,
      onClick: (event: Parameters<NonNullable<typeof onClick>>[0]) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        if (visible) {
          onHide?.();
          return;
        }
        onShow?.();
      },
    },
    children ??
      createElement(visible ? EyeOff : Eye, {
        className: 'h-4 w-4',
        'aria-hidden': true,
      }),
  );
};
export const SectionTitle = TypographyH2;
export const Select = selectElement;

export const ShellSidebar = function ShellSidebar(props: {
  title?: ReactNode;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  body?: ReactNode;
  mobileBody?: ReactNode;
  footer?: ReactNode;
}) {
  return createElement(
    'div',
    { className: 'flex h-full flex-col' },
    createElement(
      'div',
      { className: 'flex items-center justify-between border-b border-border px-4 py-4' },
      createElement(
        'div',
        { className: props.collapsed ? 'sr-only' : 'text-sm font-semibold' },
        props.title ?? null,
      ),
      props.onToggleCollapsed
        ? createElement(
            'button',
            {
              type: 'button',
              className: 'rounded-md border border-border px-2 py-1 text-xs',
              onClick: props.onToggleCollapsed,
            },
            props.collapsed ? 'Expand menu' : 'Collapse menu',
          )
        : null,
    ),
    createElement(
      'div',
      { className: 'flex-1 overflow-auto px-3 py-3' },
      props.body ?? props.mobileBody ?? null,
    ),
    props.footer
      ? createElement('div', { className: 'border-t border-border px-4 py-4' }, props.footer)
      : null,
  );
};

export const Strong = function Strong(props: Parameters<typeof TypographySmall>[0]) {
  return createElement(TypographySmall, { as: 'strong', ...props });
};
export const Subheading = TypographyH2;
export const ThemeScript = (props: { themeCookieName?: string }) =>
  createElement('script', {
    dangerouslySetInnerHTML: {
      __html: `(function(){var cookieName=${JSON.stringify(props.themeCookieName ?? 'authlab-theme')};var raw=document.cookie.split(';').map(function(part){return part.trim();}).find(function(part){return part.indexOf(cookieName+'=')===0;});var mode=raw?raw.slice(cookieName.length+1):'system';var system=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var theme=mode==='dark'||mode==='light'?mode:system;document.documentElement.dataset.theme=theme;})();`,
    },
  });
export function TransitionLink({
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { href: string }) {
  return createElement(Link, { to: href, ...props });
}

export const typographyNavLinkClassName = '';

export function useRoutePrefetch(routes?: readonly string[] | string) {
  void routes;
  return (href?: string) => {
    void href;
    return undefined;
  };
}

export function useTransitionRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => {
      navigate(href);
      return undefined;
    },
    replace: (href: string) => {
      navigate(href, { replace: true });
      return undefined;
    },
    prefetch: (href: string) => {
      void href;
      return Promise.resolve();
    },
  };
}

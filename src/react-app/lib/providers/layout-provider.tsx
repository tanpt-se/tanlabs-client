'use client';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Fragment } from 'react';

import {
  DarkBackground,
  LightBackground,
  LocaleFlag,
  StatusErrorIllustration,
  StatusNotFoundIllustration,
  StatusSessionIllustration,
} from '@tanlabs/assets';
import {
  Avatar,
  AvatarFallback,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  type SidebarItemConfig,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  TypographyH1,
  TypographyMuted,
  TypographySmall,
} from '@tanlabs/components';
import { Check, ChevronRight, LogOut, Moon, Sun } from 'lucide-react';

import { useLocale, useTheme } from './theme-provider';

export function BaseLayout({ children, className }: { children: ReactNode; className?: string }) {
  const classes = ['relative min-h-screen w-full', className].filter(Boolean).join(' ');
  return (
    <main className={classes}>
      <div className="dark:hidden">
        <LightBackground />
      </div>
      <div className="hidden dark:block">
        <DarkBackground />
      </div>
      <div className="relative z-10 min-h-full w-full">{children}</div>
    </main>
  );
}

export function StatusPage({
  code,
  title,
  description,
  dashboardHref,
  dashboardLabel,
  reloadLabel,
  onReload,
  className,
}: {
  code?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  dashboardHref?: string;
  dashboardLabel?: ReactNode;
  reloadLabel?: ReactNode;
  onReload?: () => void;
  className?: string;
}) {
  const classes = ['p-6', className].filter(Boolean).join(' ');
  const normalizedCode = typeof code === 'string' ? code : undefined;
  const illustration =
    normalizedCode === '404' ? (
      <StatusNotFoundIllustration className="text-muted-foreground h-28 w-auto" />
    ) : normalizedCode === '401' || normalizedCode === '440' ? (
      <StatusSessionIllustration className="text-muted-foreground h-28 w-auto" />
    ) : (
      <StatusErrorIllustration className="text-muted-foreground h-28 w-auto" />
    );
  return (
    <BaseLayout className={classes}>
      <div className="flex min-h-[calc(100dvh-3rem)] w-full items-center justify-center">
        <section className="border-border bg-background w-full max-w-lg rounded-lg border p-6 text-center shadow-sm">
          <div className="mb-1 flex justify-center">{illustration}</div>
          {code ? (
            <TypographySmall className="text-muted-foreground">{code}</TypographySmall>
          ) : null}
          {title ? (
            <TypographyH1 className="text-foreground mt-2 text-2xl font-semibold">
              {title}
            </TypographyH1>
          ) : null}
          {description ? <TypographyMuted className="mt-3">{description}</TypographyMuted> : null}
          {dashboardHref || reloadLabel ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              {dashboardHref ? (
                <Button asChild size="default">
                  <a href={dashboardHref}>{dashboardLabel ?? 'Go to dashboard'}</a>
                </Button>
              ) : null}
              {reloadLabel ? (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => {
                    if (onReload) {
                      onReload();
                      return;
                    }
                    window.location.reload();
                  }}
                >
                  {reloadLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </BaseLayout>
  );
}

export interface MainLayoutBrand {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
}

export interface MainLayoutUserMenu {
  userName?: ReactNode;
  email?: ReactNode;
  plan?: ReactNode;
  sidebarSubtitle?: ReactNode;
  avatar?: ReactNode;
  logoutLabel?: ReactNode;
  onLogout?: () => void | Promise<void>;
}

export interface MainLayoutSidebarGroup {
  label?: ReactNode;
  action?: ReactNode;
  items: SidebarItemConfig[];
}

export interface MainLayoutBreadcrumbItem {
  label: ReactNode;
  description?: ReactNode;
  href?: string;
}

type ExtendedSidebarItem = SidebarItemConfig & {
  action?: ReactNode;
  badge?: ReactNode;
};

export function MainLayout({
  header,
  breadcrumbs,
  brand,
  userMenu,
  onNavigate,
  sidebarGroups,
  sidebarItems,
  sidebarGroupLabel,
  content,
  children,
}: {
  header?: ReactNode;
  breadcrumbs?: MainLayoutBreadcrumbItem[];
  brand?: MainLayoutBrand;
  userMenu?: MainLayoutUserMenu;
  onNavigate?: (href: string) => void;
  sidebarGroups?: MainLayoutSidebarGroup[];
  sidebarItems?: SidebarItemConfig[];
  sidebarGroupLabel?: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
}) {
  const { themeMode, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const groups: MainLayoutSidebarGroup[] =
    sidebarGroups ?? (sidebarItems ? [{ label: sidebarGroupLabel, items: sidebarItems }] : []);

  const shouldHandleClientNavigation = (event: MouseEvent<HTMLAnchorElement>) =>
    !(
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    );

  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          '--sidebar-width': '288px',
          '--sidebar-width-mobile': '320px',
        } as CSSProperties
      }
    >
      <Sidebar collapsible="icon">
        {brand ? (
          <SidebarHeader className="min-h-16 justify-center py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 justify-start gap-2 text-left group-data-[collapsible=icon]:justify-center">
                  <div className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                    {brand.icon ?? (
                      <span className="text-sm font-semibold">
                        {typeof brand.title === 'string'
                          ? brand.title.slice(0, 1).toUpperCase()
                          : 'A'}
                      </span>
                    )}
                  </div>
                  <div className="grid flex-1 justify-items-start text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{brand.title}</span>
                    {brand.subtitle ? (
                      <span className="text-muted-foreground truncate text-xs">
                        {brand.subtitle}
                      </span>
                    ) : null}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
        ) : null}

        <SidebarContent className="flex-1">
          {groups.map((group, index) => (
            <SidebarGroup key={index}>
              {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
              {group.action ? <SidebarGroupAction>{group.action}</SidebarGroupAction> : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const menuItem = item as ExtendedSidebarItem;
                    const subItems = item.children ?? [];

                    return (
                      <SidebarMenuItem key={item.key ?? item.href ?? String(item.label ?? '')}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.active}
                          className="justify-start text-left"
                          tooltip={typeof item.label === 'string' ? item.label : undefined}
                        >
                          <a
                            href={item.href ?? '#'}
                            className="flex w-full items-center gap-2 text-left"
                            onClick={(event) => {
                              if (
                                !item.href ||
                                !onNavigate ||
                                !shouldHandleClientNavigation(event)
                              ) {
                                return;
                              }
                              event.preventDefault();
                              onNavigate(item.href);
                            }}
                          >
                            {item.icon ?? null}
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>

                        {menuItem.action ? (
                          <SidebarMenuAction>{menuItem.action}</SidebarMenuAction>
                        ) : null}
                        {menuItem.badge ? (
                          <SidebarMenuBadge>{menuItem.badge}</SidebarMenuBadge>
                        ) : null}

                        {subItems.length > 0 ? (
                          <SidebarMenuSub>
                            {subItems.map((subItem) => (
                              <SidebarMenuSubItem
                                key={subItem.key ?? subItem.href ?? String(subItem.label ?? '')}
                              >
                                <SidebarMenuSubButton asChild isActive={subItem.active}>
                                  <a
                                    href={subItem.href ?? '#'}
                                    className="flex w-full items-center text-left"
                                    onClick={(event) => {
                                      if (
                                        !subItem.href ||
                                        !onNavigate ||
                                        !shouldHandleClientNavigation(event)
                                      ) {
                                        return;
                                      }
                                      event.preventDefault();
                                      onNavigate(subItem.href);
                                    }}
                                  >
                                    <span>{subItem.label}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="mt-auto py-2">
          {userMenu ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="h-10 justify-start gap-2 text-left group-data-[collapsible=icon]:justify-center">
                      <Avatar className="size-8 shrink-0 group-data-[collapsible=icon]:size-4">
                        <AvatarFallback>
                          {userMenu.avatar ??
                            (typeof userMenu.userName === 'string'
                              ? userMenu.userName.slice(0, 1).toUpperCase()
                              : 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 justify-items-start text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-medium">{userMenu.userName ?? ''}</span>
                        {(userMenu.sidebarSubtitle ?? userMenu.email) ? (
                          <span className="text-muted-foreground truncate text-xs">
                            {userMenu.sidebarSubtitle ?? userMenu.email}
                          </span>
                        ) : null}
                      </div>
                      <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    sideOffset={8}
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                  >
                    <DropdownMenuLabel className="space-y-1 text-sm leading-tight">
                      {userMenu.plan ? (
                        <span className="text-muted-foreground block text-xs font-normal">
                          {userMenu.plan}
                        </span>
                      ) : null}
                      <span className="text-foreground block truncate text-sm font-medium">
                        {userMenu.userName ?? ''}
                      </span>
                      {userMenu.email ? (
                        <span className="text-muted-foreground block truncate text-xs font-normal">
                          {userMenu.email}
                        </span>
                      ) : null}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={themeMode}
                      onValueChange={(value) => setTheme(value as typeof themeMode)}
                    >
                      <DropdownMenuRadioItem value="light">
                        <Sun className="mr-2 size-4" />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <Moon className="mr-2 size-4" />
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system">
                        <Check className="mr-2 size-4" />
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Language</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={locale}
                      onValueChange={(value) => setLocale(value as typeof locale)}
                    >
                      <DropdownMenuRadioItem value="en">
                        <span className="mr-2 shrink-0">
                          <LocaleFlag locale="en" />
                        </span>
                        English
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="vi">
                        <span className="mr-2 shrink-0">
                          <LocaleFlag locale="vi" />
                        </span>
                        Vietnamese
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="ja">
                        <span className="mr-2 shrink-0">
                          <LocaleFlag locale="ja" />
                        </span>
                        Japanese
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="ko">
                        <span className="mr-2 shrink-0">
                          <LocaleFlag locale="ko" />
                        </span>
                        Korean
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    {userMenu.onLogout ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            void userMenu.onLogout?.();
                          }}
                        >
                          <LogOut className="mr-2 size-4" />
                          {userMenu.logoutLabel ?? 'Logout'}
                        </DropdownMenuItem>
                      </>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : null}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex min-h-16 shrink-0 items-center gap-2 py-2">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <div className="min-w-0">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((item, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      const key =
                        item.href ?? `${index}-${typeof item.label === 'string' ? item.label : ''}`;
                      return (
                        <Fragment key={key}>
                          <BreadcrumbItem className={isLast ? undefined : 'hidden md:block'}>
                            {isLast || !item.href ? (
                              <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {isLast ? null : <BreadcrumbSeparator className="hidden md:block" />}
                        </Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
                {breadcrumbs[breadcrumbs.length - 1]?.description ? (
                  <p className="text-muted-foreground pt-0.5 text-xs">
                    {breadcrumbs[breadcrumbs.length - 1]?.description}
                  </p>
                ) : null}
              </div>
            ) : null}
            {header ? <div className="min-w-0 flex-1">{header}</div> : null}
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{content ?? children ?? null}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

'use client';

import { Button, type ButtonProps, Icon, icons } from '@tanlabs/components';

import { useTheme } from './theme-provider';

export function ThemeToggleButton(props: ButtonProps) {
  const { theme, setTheme } = useTheme();
  const { children, onClick, type, variant = 'ghost', size = 'icon', ...rest } = props;
  const isDark = theme === 'dark';

  return (
    <Button
      {...rest}
      type={type ?? 'button'}
      variant={variant}
      size={size}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      {children ?? (
        <span
          aria-hidden="true"
          className="relative inline-flex h-4 w-4 items-center justify-center"
        >
          <Icon
            icon={icons.sun}
            className={[
              'absolute h-4 w-4 transform-gpu transition-all duration-200',
              isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0',
            ].join(' ')}
            aria-hidden="true"
          />
          <Icon
            icon={icons.moon}
            className={[
              'absolute h-4 w-4 transform-gpu transition-all duration-200',
              isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
            ].join(' ')}
            aria-hidden="true"
          />
        </span>
      )}
    </Button>
  );
}

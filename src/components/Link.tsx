import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  onNavigate?: (href: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({
  href,
  onNavigate,
  children,
  className,
  onClick,
  target,
  rel,
  ...rest
}) => {
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (e.defaultPrevented) return;

    // Allow browser default behavior for middle-click or modified clicks (new tab/window)
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    if (!isExternal && (!target || target === '_self')) {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const computedRel = isExternal && !rel ? 'noopener noreferrer' : rel;

  return (
    <a
      href={href}
      onClick={handleClick}
      target={target}
      rel={computedRel}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;

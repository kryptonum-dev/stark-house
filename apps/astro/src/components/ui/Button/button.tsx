import styles from './styles.module.scss'

export type Props = React.HTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  text?: string | React.ReactNode
  theme?: 'primary' | 'secondary'
  linkType?: 'external' | 'internal' | 'internalId' | undefined
  href?: string
  className?: string
}

export default function Button({ children, text, theme = 'primary', linkType = 'internal', href, className, ...props }: Props) {
  const isExternal = linkType === 'external'
  const renderedChildren = children || text
  const buttonClassName = `${styles.button}${className ? ` ${className}` : ''}`

  return !!href ? (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      data-theme={theme}
      className={buttonClassName}
      {...props}
    >
      {renderedChildren}
    </a>
  ) : (
    <button data-theme={theme} className={buttonClassName} {...props}>
      {renderedChildren}
    </button>
  )
}

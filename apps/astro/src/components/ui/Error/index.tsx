import styles from './styles.module.scss'

type Props = {
  error?: string;
}

export default function Error({ error }: Props) {
  return (
    error && (
      <span
        className={styles.error}
        aria-live="assertive"
        role='alert'
      >
        <ErrorIcon />
        {error}
      </span>
    )
  );
}

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none">
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M8 5.565v2.667m0 2.666h.007m6.66-2.666a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
    />
  </svg>
)

import styles from './styles.module.scss';

export default function Loader({ loading }: { loading: boolean }) {
  return (
    loading && (
      <div className={styles.loader} aria-label='Ładowanie...'>
        <CircleLoaderIcon className={styles.icon} />
      </div>
    )
  );
}

const CircleLoaderIcon = ({ ...props }) => {
  return (
    <svg
      width={18}
      height={18}
      viewBox='25 25 50 50'
      {...props}
    >
      <circle
        cx='50'
        cy='50'
        r='20'
        fill='none'
        stroke='currentColor'
        strokeWidth='5'
      />
    </svg>
  );
};

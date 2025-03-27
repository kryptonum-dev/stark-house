
import Button from '@components/ui/Button';
import styles from './styles.module.scss';

type Props = {
  success: { heading: string, paragraph: React.ReactNode };
  error: { heading: string, paragraph: React.ReactNode };
  isSuccess: boolean | undefined;
  setStatus: (status: FormStatusTypes) => void;
}

export default function FormState({ success, error, isSuccess, setStatus }: Props) {
  return (
    isSuccess !== undefined && (
      <div
        className={styles.FormState}
        data-form-state
        data-is-success={!!isSuccess}
      >
        <h3>
          {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
          <span>{isSuccess ? success.heading : error.heading}</span>
        </h3>
        <div className={styles.paragraph}>
          {isSuccess ? success.paragraph : error.paragraph}
        </div>
        {isSuccess === false && (
          <>
            <Button
              type='button'
              onClick={() => setStatus({ sending: false, success: undefined })}
            >
              Spróbuj ponownie
            </Button>
          </>
        )}
      </div>
    )
  );
}

const SuccessIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='28' height='29' fill='none'>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M10.111 15.024l1.757 2.007a1.167 1.167 0 001.824-.085l4.197-5.811'
    ></path>
    <circle
      cx='14'
      cy='14.285'
      r='10.5'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></circle>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='28' height='29' fill='none'>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M14 9.618v4.667m0 4.666h.011m11.655-4.666c0 6.443-5.223 11.666-11.666 11.666-6.444 0-11.667-5.223-11.667-11.666C2.333 7.842 7.556 2.618 14 2.618c6.443 0 11.666 5.224 11.666 11.667z'
    ></path>
  </svg>
);

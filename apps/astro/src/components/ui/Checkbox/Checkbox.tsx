import Error from '@components/ui/Error'
import styles from './styles.module.scss'
import type { FieldErrors } from 'react-hook-form';

type Props = {
  register: {
    name: string
  }
  children: React.ReactNode
  errors: FieldErrors;
} & React.HTMLAttributes<HTMLLabelElement>

export default function Checkbox({ children, register, errors, ...props }: Props) {
  return (
    <label className={styles.label} {...props}>
      <div className={styles.checkmark}>
        <input type="checkbox" {...register} aria-invalid={!!errors[register.name]} />
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" fill="none">
          <path stroke="#DBB039" stroke-width="2" d="M.987 4.974 5.013 9l8-8"></path>
        </svg>
      </div>
      <p>{children}</p>
      <Error error={errors[register.name]?.message?.toString()} />
    </label>
  )
}

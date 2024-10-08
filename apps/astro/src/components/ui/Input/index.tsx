import type { FieldErrors } from 'react-hook-form'
import styles from './styles.module.scss'
import Error from '@/src/components/ui/Error'
import Textarea from './Textarea'

type Props = {
  register: {
    name: string
  }
  label: string
  isTextarea?: boolean
  errors: FieldErrors;
} & React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>

export default function Input({ register, label, isTextarea, errors, ...props }: Props) {
  const Element = isTextarea ? Textarea : 'input'

  return (
    <label className={styles.label}>
      <p className="label">{label}</p>
      <Element {...register} {...props} placeholder=" " aria-invalid={!!errors[register.name]} />
      <Error error={errors[register.name]?.message?.toString()} />
    </label>
  )
}

import type { FieldErrors } from 'react-hook-form'
import styles from './Input.module.scss'
import Error from '@components/ui/Error'
import Textarea from './Textarea'

type Props = {
  register: {
    name: string
  }
  label: string
  isTextarea?: boolean
  errors: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>

export default function Input({ register, label, isTextarea, errors, placeholder, ...props }: Props) {
  const Element = isTextarea ? Textarea : 'input'

  return (
    <label className={styles.Input}>
      <p className="label">{label}</p>
      <Element {...register} {...props} placeholder={placeholder || ' '} aria-invalid={!!errors[register.name]} />
      <Error error={errors[register.name]?.message?.toString()} />
    </label>
  )
}

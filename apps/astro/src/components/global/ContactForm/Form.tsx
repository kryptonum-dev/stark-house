import { useState } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import styles from './styles.module.scss';
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import Button from '@/src/components/ui/Button';
import Loader from '@/components/ui/Loader';
import FormState from '@/components/ui/FormState';
import { REGEX } from '@/global/constants';

export default function Form() {
  const [status, setStatus] = useState<FormStatusTypes>({ sending: false, success: undefined });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true, success: undefined });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        setStatus({ sending: false, success: true });
        reset();
      } else {
        setStatus({ sending: false, success: false });
      }
    } catch {
      setStatus({ sending: false, success: false });
    }
  };

  return (
    <form className={`${styles.form} Form`} onSubmit={handleSubmit(onSubmit)}>
      <Input
        label='Email'
        register={register('email', {
          required: { value: true, message: 'Email jest wymagany' },
          pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
        })}
        errors={errors}
      />
      <Input
        label='Telefon (opcjonalnie)'
        register={register('phone', {
          pattern: { value: REGEX.phone, message: 'Niepoprawny numer telefonu' },
        })}
        errors={errors}
      />
      <Input
        label='Twoja wiadomość'
        register={register('message', {
          required: { value: true, message: 'Wiadomość jest wymagana' },
        })}
        isTextarea={true}
        errors={errors}
      />
      <Checkbox
        register={register('legal', {
          required: { value: true, message: 'Zgoda jest wymagana' },
        })}
        errors={errors}
      >
        Akceptuję <a href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="link">
          politykę prywatności
        </a>
      </Checkbox>
      <Button type="submit" className={styles.cta}>Zapisz się do newslettera</Button>

      <Loader loading={status.sending} />
      <FormState
        success={{
          heading: 'Dziękujemy za kontakt',
          paragraph: <p>Twoja wiadomość właśnie dotarła do naszej skrzynki mailowej. Odezwiemy się najszybciej, jak to możliwe.</p>
        }}
        error={{
          heading: 'Nie udało się wysłać wiadomości',
          paragraph: <>
            <p>Podczas przesyłania, wystąpił problem z serwerem. Wyślij wiadomość ponownie. W razie niepowodzenia, skontaktuj się z nami mailowo: <a href="mailto:kontakt@starkhouse.com" className='link'>kontakt@starkhouse.com</a>
            </p>
          </>,
        }}
        isSuccess={status.success}
        setStatus={setStatus}
      />
    </form>
  )
}

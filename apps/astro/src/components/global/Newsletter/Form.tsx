import { useState } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import styles from './styles.module.scss';
import Input from '@components/ui/Input'
import Checkbox from '@components/ui/Checkbox/Checkbox'
import Button from '@components/ui/Button';
import Loader from '@components/ui/Loader';
import FormState from '@components/ui/FormState';
import { REGEX } from '@global/constants';
import { trackEvent } from '@pages/api/analytics/track-event';

type Props = {
  groupId: string;
  analytics?: {
    linkedin_conversion?: {
      pixel_conversion_id: number;
      direct_api_conversion_id: number;
    }
  }
};

export default function Form({ groupId, analytics }: Props) {
  const [status, setStatus] = useState<FormStatusTypes>({ sending: false, success: undefined });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true, success: undefined });
    data.group_id = groupId
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        setStatus({ sending: false, success: true });
        reset();

        await trackEvent({
          user_data: {
            name: data.name,
            email: data.email
          },
          meta: {
            event_name: 'Lead',
            content_name: 'Newsletter Form'
          },
          ...(analytics?.linkedin_conversion && {
            linkedin: {
              pixel_conversion_id: analytics.linkedin_conversion.pixel_conversion_id,
              direct_api_conversion_id: analytics.linkedin_conversion.direct_api_conversion_id
            }
          }),
        });
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
        label='Imię'
        register={register('name', {
          required: { value: true, message: 'Imię jest wymagane' },
          minLength: { value: 2, message: 'Imię jest za krótkie' },
          pattern: { value: REGEX.string, message: 'Imię jest wymagane' },
        })}
        errors={errors}
      />
      <Input
        label='Email'
        register={register('email', {
          required: { value: true, message: 'Email jest wymagany' },
          pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
        })}
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
      <Button type="submit" className={`${styles.cta} cta`}>Zapisz się do newslettera</Button>

      <Loader loading={status.sending} />
      <FormState
        success={{
          heading: 'Dziękujemy za zapis do newslettera!',
          paragraph: <p>Od teraz będziesz na bieżąco z nowościami i aktualnościami!</p>
        }}
        error={{
          heading: 'Nie udało się zapisać do newslettera',
          paragraph: <>
            <p>Podczas przesyłania informacji pojawił się problem z serwerem. Spróbuj ponownie!</p>
            <p>Jeśli problem się powtórzy, skontaktuj się z nami przez formularz kontaktowy lub napisz na adres:&nbsp;
              <a href="mailto:kontakt@starkhouse.com" className='link'>kontakt@starkhouse.com</a>
            </p>
          </>,
        }}
        isSuccess={status.success}
        setStatus={setStatus}
      />
    </form>
  );
}

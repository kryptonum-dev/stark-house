import { useState } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import styles from '../ContactForm/styles.module.scss';
import Input from '@components/ui/Input'
import Checkbox from '@components/ui/Checkbox/Checkbox'
import Button from '@components/ui/Button';
import Loader from '@components/ui/Loader';
import FormState from '@components/ui/FormState';
import { REGEX } from '@global/constants';
import { trackEvent } from '@pages/api/analytics/track-event';

type Props = {
  groupId?: string;
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
    try {
      const payload: Record<string, any> = {
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        company: data.company,
        position: data.position || '',
        legal: !!data.legal,
      };
      if (groupId) payload.group_id = groupId;

      const response = await fetch('/api/expo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        setStatus({ sending: false, success: true });
        reset();
        await trackEvent({
          user_data: {
            name: data.fullname,
            email: data.email,
            phone: data.phone
          },
          meta: {
            event_name: 'Lead',
            content_name: 'Expo Lead Form'
          },
          ...((analytics?.linkedin_conversion && data.email) && {
            linkedin: {
              pixel_conversion_id: analytics.linkedin_conversion.pixel_conversion_id,
              direct_api_conversion_id: analytics.linkedin_conversion.direct_api_conversion_id
            }
          }),
          tiktok: { event_name: 'SubmitForm' }
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
      <div className={styles.column}>
        <Input
          label='Imię i nazwisko*'
          type='text'
          register={register('fullname', {
            required: { value: true, message: 'Imię i nazwisko jest wymagane' },
            minLength: { value: 3, message: 'Wpisz pełne imię i nazwisko' },
          })}
          errors={errors}
        />
        <Input
          label='Numer telefonu*'
          type='tel'
          register={register('phone', {
            required: { value: true, message: 'Numer telefonu jest wymagany' },
            pattern: { value: REGEX.phone, message: 'Niepoprawny numer telefonu' },
          })}
          errors={errors}
        />
      </div>
      <Input
        label='Adres e-mail*'
        type='email'
        register={register('email', {
          required: { value: true, message: 'Email jest wymagany' },
          pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
        })}
        errors={errors}
      />
      <div className={styles.column}>
        <Input
          label='Nazwa firmy*'
          type='text'
          register={register('company', {
            required: { value: true, message: 'Nazwa firmy jest wymagana' },
            minLength: { value: 2, message: 'Nazwa firmy jest za krótka' },
          })}
          errors={errors}
        />
        <Input
          label='Stanowisko (opcjonalne)'
          type='text'
          register={register('position')}
          errors={errors}
        />
      </div>
      <Checkbox
        register={register('legal', {
          required: { value: true, message: 'Zgoda jest wymagana' },
        })}
        errors={errors}
      >
        Akceptuję <a href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="link">politykę prywatności</a>
      </Checkbox>
      <Button type="submit" className={`${styles.cta} cta`}>Odbierz katalog PDF</Button>

      <Loader loading={status.sending} />
      <FormState
        success={{
          heading: 'Dziękujemy za odwiedziny stoiska Stark House',
          paragraph: <p>Na podany adres e-mail wysłaliśmy katalog Stark House.</p>
        }}
        error={{
          heading: 'Nie udało się wysłać formularza',
          paragraph: <>
            <p>Spróbuj ponownie. Jeśli problem się powtórzy, napisz: <a href="mailto:kontakt@starkhouse.com" className='link'>kontakt@starkhouse.com</a></p>
          </>,
        }}
        isSuccess={status.success}
        setStatus={setStatus}
      />
    </form>
  )
}



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
  analytics?: {
    linkedin_conversion?: {
      pixel_conversion_id: number;
      direct_api_conversion_id: number;
    }
  }
};

export default function Form({ analytics }: Props) {
  const [status, setStatus] = useState<FormStatusTypes>({ sending: false, success: undefined });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ mode: 'onTouched' });

  const clientType = watch('clientType', 'individual');
  const parkingSpaces = watch('parkingSpaces', 'less10');

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
        await trackEvent({
          user_data: {
            email: data.email,
            phone: data.phone
          },
          meta: {
            event_name: 'Lead',
            content_name: 'Contact Form'
          },
          ...((analytics?.linkedin_conversion && data.email) && {
            linkedin: {
              pixel_conversion_id: analytics.linkedin_conversion.pixel_conversion_id,
              direct_api_conversion_id: analytics.linkedin_conversion.direct_api_conversion_id
            }
          }),
          tiktok: {
            event_name: 'SubmitForm'
          }
        });
      } else {
        setStatus({ sending: false, success: false });
      }
    } catch {
      setStatus({ sending: false, success: false });
    }
  };

  const handleClientTypeChange = (type: 'individual' | 'business') => {
    setValue('clientType', type);
    if (type === 'individual') {
      setValue('nip', '');
    }
  };

  const handleParkingSpacesChange = (value: 'less10' | '10to50' | 'more50') => {
    setValue('parkingSpaces', value);
  };

  return (
    <form className={`${styles.form} Form`} onSubmit={handleSubmit(onSubmit)}>
      <div key="form-info" className={`${styles.formInfo} ${styles.fadeInBlur}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
        </svg>
        <p>Po podaniu adresu e-mail i uzupełnieniu formularza wyślemy Ci nasz katalog.</p>
      </div>
      <div className={styles.column}>
        <Input
          label='Numer telefonu*'
          type='tel'
          register={register('phone', {
            required: { value: true, message: 'Numer telefonu jest wymagany' },
            pattern: {
              value: REGEX.phone,
              message: 'Niepoprawny numer telefonu'
            },
          })}
          errors={errors}
        />
        <Input
          label='Adres e-mail'
          type='email'
          register={register('email', {
            pattern: {
              value: REGEX.email,
              message: 'Niepoprawny adres e-mail'
            },
          })}
          errors={errors}
        />
      </div>
      <div className={styles.parkingSpacesSection}>
        <div className={styles.parkingSpacesLabel}>
          <label>Liczba miejsc parkingowych*</label>
        </div>
        <div
          className={`${styles.pillSelector} ${styles.parkingSpacesPills}`}
          role="radiogroup"
          aria-label="Wybierz liczbę miejsc parkingowych"
          data-selected={parkingSpaces}
        >
          <button
            type="button"
            role="radio"
            aria-checked={parkingSpaces === 'less10'}
            className={`${styles.pill} ${parkingSpaces === 'less10' ? styles.active : ''}`}
            onClick={() => handleParkingSpacesChange('less10')}
          >
            {'< 10'}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={parkingSpaces === '10to50'}
            className={`${styles.pill} ${parkingSpaces === '10to50' ? styles.active : ''}`}
            onClick={() => handleParkingSpacesChange('10to50')}
          >
            10-50
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={parkingSpaces === 'more50'}
            className={`${styles.pill} ${parkingSpaces === 'more50' ? styles.active : ''}`}
            onClick={() => handleParkingSpacesChange('more50')}
          >
            50+
          </button>
          <input
            type="hidden"
            {...register('parkingSpaces', {
              required: { value: true, message: 'Wybór liczby miejsc parkingowych jest wymagany' }
            })}
            value={parkingSpaces}
          />
        </div>
      </div>
      <div className={styles.column}>
        <Input
          label='Imię i nazwisko'
          type='text'
          register={register('fullname')}
          errors={errors}
        />
        <Input
          label='Miasto'
          type='text'
          register={register('city')}
          errors={errors}
        />
      </div>
      <div
        className={`${styles.pillSelector} ${styles.clientTypePills}`}
        role="tablist"
        aria-label="Wybierz typ klienta"
        data-type={clientType}
      >
        <button
          type="button"
          role="tab"
          aria-selected={clientType === 'individual'}
          id="client-individual-tab"
          aria-controls="client-individual-panel"
          className={`${styles.pill} ${clientType === 'individual' ? styles.active : ''}`}
          onClick={() => handleClientTypeChange('individual')}
        >
          Klient indywidualny
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={clientType === 'business'}
          id="client-business-tab"
          aria-controls="client-business-panel"
          className={`${styles.pill} ${clientType === 'business' ? styles.active : ''}`}
          onClick={() => handleClientTypeChange('business')}
        >
          Klient biznesowy
        </button>
        <input
          type="hidden"
          {...register('clientType')}
          value={clientType}
        />
      </div>
      {clientType === 'business' && (
        <div key="nip-field" className={styles.fadeInBlur}>
          <Input
            label='Numer NIP'
            type='text'
            inputMode='numeric'
            register={register('nip', {
              validate: {
                validNip: (value) => {
                  if (!value) return true;
                  const nip = value.replace(/[\ \-]/gi, '');
                  if (!/^\d{10}$/.test(nip)) {
                    return 'NIP musi składać się z 10 cyfr';
                  }
                  const weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
                  let sum = 0;
                  const controlNumber = parseInt(nip.substring(9, 10));
                  for (let i = 0; i < 9; i++) {
                    sum += parseInt(nip.charAt(i)) * weight[i];
                  }
                  return (sum % 11) === controlNumber || 'Nieprawidłowy numer NIP - błędna cyfra kontrolna';
                }
              }
            })}
            placeholder="np. 123-456-78-90"
            errors={errors}
          />
        </div>
      )}
      <Input
        label='Twoja wiadomość*'
        register={register('message', {
          required: { value: true, message: 'Wiadomość jest wymagana' },
        })}
        isTextarea={true}
        placeholder='Wpisz swoją wiadomość'
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
      <Button type="submit" className={`${styles.cta} cta`}>Wyślij wiadomość</Button>

      <Loader loading={status.sending} />
      <FormState
        success={{
          heading: 'Dziękujemy za kontakt',
          paragraph: <p>Twoja wiadomość właśnie dotarła do naszej skrzynki mailowej. Odezwiemy się najszybciej, jak to możliwe.</p>
        }}
        error={{
          heading: 'Nie udało się wysłać wiadomości',
          paragraph: <>
            <p>Podczas przesyłania, wystąpił problem z serwerem. Wyślij wiadomość ponownie. W razie niepowodzenia, skontaktuj się z nami mailowo: <a href="mailto:kontakt@starkhouse.com" className='link'>kontakt@starkhouse.com</a>
            </p>
          </>,
        }}
        isSuccess={status.success}
        setStatus={setStatus}
      />
    </form>
  )
}

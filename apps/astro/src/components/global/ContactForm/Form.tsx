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

  const contactType = watch('contactType', 'email');
  const clientType = watch('clientType', 'individual');

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
            email: contactType === 'email' ? data.contactValue : undefined,
            phone: contactType === 'phone' ? data.contactValue : undefined
          },
          meta: {
            event_name: 'Lead',
            content_name: 'Contact Form'
          },
          ...((analytics?.linkedin_conversion && contactType === 'email') && {
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

  const handleContactTypeChange = (type: 'email' | 'phone') => {
    setValue('contactType', type);
    setValue('contactValue', '');
  };

  const handleClientTypeChange = (type: 'individual' | 'business') => {
    setValue('clientType', type);
    if (type === 'individual') {
      setValue('nip', '');
    }
  };

  return (
    <form className={`${styles.form} Form`} onSubmit={handleSubmit(onSubmit)}>
      <div
        className={styles.pillSelector}
        role="tablist"
        aria-label="Wybierz metodę kontaktu"
        data-type={contactType}
      >
        <button
          type="button"
          role="tab"
          aria-selected={contactType === 'email'}
          id="contact-email-tab"
          aria-controls="contact-email-panel"
          className={`${styles.pill} ${contactType === 'email' ? styles.active : ''}`}
          onClick={() => handleContactTypeChange('email')}
        >
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={contactType === 'phone'}
          id="contact-phone-tab"
          aria-controls="contact-phone-panel"
          className={`${styles.pill} ${contactType === 'phone' ? styles.active : ''}`}
          onClick={() => handleContactTypeChange('phone')}
        >
          Telefon
        </button>
        <input
          type="hidden"
          {...register('contactType')}
          value={contactType}
        />
      </div>

      {contactType === 'email' && (
        <div key="email-info" className={`${styles.formInfo} ${styles.fadeInBlur}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          <p>Po uzupełnieniu formularza wyślemy Ci nasz katalog oraz link do platformy, gdzie w 2 minuty uzyskasz wycenę swojego projektu.</p>
        </div>
      )}
      <div
        role="tabpanel"
        id={contactType === 'email' ? 'contact-email-panel' : 'contact-phone-panel'}
        aria-labelledby={contactType === 'email' ? 'contact-email-tab' : 'contact-phone-tab'}
        key={`contact-${contactType}-panel`}
        className={styles.fadeInBlur}
      >
        <Input
          label={contactType === 'email' ? 'Adres e-mail*' : 'Numer telefonu*'}
          type={contactType === 'email' ? 'email' : 'tel'}
          register={register('contactValue', {
            required: { value: true, message: contactType === 'email' ? 'Email jest wymagany' : 'Numer telefonu jest wymagany' },
            pattern: {
              value: contactType === 'email' ? REGEX.email : REGEX.phone,
              message: contactType === 'email' ? 'Niepoprawny adres e-mail' : 'Niepoprawny numer telefonu'
            },
          })}
          errors={errors}
        />
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
            type='number'
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

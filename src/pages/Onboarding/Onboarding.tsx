import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import { onboardingSources, onboardingDeviceInfo, type OnboardingSourceId } from '../../data/onboarding';
import styles from './Onboarding.module.css';

const sourceIcons: Record<OnboardingSourceId, 'document' | 'discovery'> = {
  uploaded: 'document',
  controller: 'discovery',
};

function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12.9804 0.998474H4.99246C3.88956 0.998474 2.99548 1.89255 2.99548 2.99545V14.9773C2.99548 16.0802 3.88956 16.9743 4.99246 16.9743H12.9804C14.0833 16.9743 14.9774 16.0802 14.9774 14.9773V2.99545C14.9774 1.89255 14.0833 0.998474 12.9804 0.998474Z"
        stroke="currentColor"
        strokeWidth="1.49773"
      />
      <path
        d="M5.99091 4.99243H7.98788M5.99091 7.9879H11.9818M5.99091 10.9834H11.9818M5.99091 13.9788H9.98486"
        stroke="currentColor"
        strokeWidth="1.49773"
        strokeLinecap="round"
      />
      <path
        d="M9.98486 0.998474V4.49319C9.98486 4.62559 10.0375 4.75258 10.1311 4.8462C10.2247 4.93983 10.3517 4.99243 10.4841 4.99243H12.9803"
        stroke="currentColor"
        strokeWidth="1.49773"
      />
    </svg>
  );
}

function DiscoveryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M9.75 1.5L4.5 9.75H8.25L7.5 16.5L13.5 8.25H9.75L9.75 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OnboardingContent() {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState<OnboardingSourceId>('uploaded');
  const [registered, setRegistered] = useState(false);

  const source = onboardingSources.find((s) => s.id === selectedSource)!;

  const fields: Array<{ label: string; value: string }> = [
    { label: 'Utility Meter', value: onboardingDeviceInfo.utilityMeter },
    { label: 'Device ID', value: onboardingDeviceInfo.deviceId },
    { label: 'IMEI', value: onboardingDeviceInfo.imei },
    { label: 'ICCID', value: onboardingDeviceInfo.iccid },
    { label: 'OEM / Manufacturer', value: onboardingDeviceInfo.oem },
    { label: 'OEM Model', value: onboardingDeviceInfo.oemModel },
    { label: 'Chipset', value: onboardingDeviceInfo.chipset },
    { label: 'Firmware', value: onboardingDeviceInfo.firmware },
  ];

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Choose Onboarding Source</h2>
            <p className={styles.cardSubtitle}>Select the source from which device information is available.</p>
          </div>
          <span className={styles.stepPill}>Step 1</span>
        </div>

        <div className={styles.sourceGrid}>
          {onboardingSources.map((s) => {
            const isSelected = s.id === selectedSource;
            const icon = sourceIcons[s.id];
            return (
              <button
                key={s.id}
                type="button"
                className={`${styles.sourceCard} ${isSelected ? styles.sourceCardSelected : ''}`}
                onClick={() => setSelectedSource(s.id)}
              >
                <span className={styles.sourceEnvNote}>Disabled in Dev | Enabled in Production</span>
                <span className={styles.sourceIconWrap}>
                  {icon === 'discovery' ? <DiscoveryIcon /> : <DocumentIcon />}
                </span>
                <span className={styles.sourceTitle}>{s.title}</span>
                <span className={styles.sourceDescription}>{s.description}</span>
                {isSelected && <span className={styles.selectedPill}>Selected</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Device Information</h2>
            <p className={styles.cardSubtitle}>Source: {source.title}</p>
          </div>
          <StatusBadge label="Ready" tone="green" />
        </div>

        <div className={styles.fieldGrid}>
          {fields.map((field) => (
            <div key={field.label} className={styles.fieldBox}>
              <div className={styles.fieldLabel}>{field.label}</div>
              <div className={styles.fieldValue}>{field.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Onboarding Flow</h2>
            <p className={styles.cardSubtitle}>Validate the source data, register the device, then continue to SIM Applet management.</p>
          </div>
          <span className={styles.stepPill}>Step {registered ? 3 : 2} of 3</span>
        </div>

        <div className={styles.trackerRow}>
          <span className={`${styles.trackerStep} ${styles.trackerStepDone}`}>1&nbsp;&nbsp;Source selected</span>
          <span className={`${styles.trackerStep} ${styles.trackerStepDone}`}>2&nbsp;&nbsp;Data ready</span>
          <span className={`${styles.trackerStep} ${registered ? styles.trackerStepDone : ''}`}>
            3&nbsp;&nbsp;Register device
          </span>
        </div>

        <div className={styles.actionRow}>
          <button type="button" className={styles.secondaryButton}>
            Validate Device
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={registered}
            onClick={() => setRegistered(true)}
          >
            {registered ? 'Registered' : 'Register & Continue'}
          </button>
        </div>

        {registered && (
          <div className={styles.successBanner}>
            <div>
              <h3 className={styles.successTitle}>Onboarding Initiated</h3>
              <p className={styles.successSubtitle}>
                {onboardingDeviceInfo.deviceId} registered and ready for SIM Applet selection.
              </p>
            </div>
            <button type="button" className={styles.successButton} onClick={() => navigate('/sim-applet')}>
              Open SIM Applet Management
            </button>
          </div>
        )}
      </div>
    </>
  );
}

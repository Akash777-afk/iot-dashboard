import { useMemo, useState } from 'react';
import { icons } from '../assets/icons';
import {
  DEVICE_TYPES,
  HARDWARE_REVISIONS,
  REGION_SCOPES,
  simAppletCatalog,
  findConflict,
  type DeviceMapping,
  type DeviceTypeName,
  type RegionScope,
} from '../data/defaultMapping';
import styles from './CreateMappingModal.module.css';

interface CreateMappingModalProps {
  mode: 'create' | 'edit';
  initial?: DeviceMapping;
  mappings: DeviceMapping[];
  onCancel: () => void;
  onSave: (mapping: DeviceMapping) => void;
}

export function CreateMappingModal({ mode, initial, mappings, onCancel, onSave }: CreateMappingModalProps) {
  const [deviceType, setDeviceType] = useState<DeviceTypeName>(initial?.deviceType ?? DEVICE_TYPES[0]);
  const [oem, setOem] = useState(initial?.oem ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [hardwareRevision, setHardwareRevision] = useState(initial?.hardwareRevision ?? HARDWARE_REVISIONS[0]);
  const [firmwareVersion, setFirmwareVersion] = useState(initial?.firmwareVersion ?? '');
  const [appletId, setAppletId] = useState(initial?.appletId ?? simAppletCatalog[0].id);
  const [appletVersion, setAppletVersion] = useState(
    initial?.appletVersion ?? simAppletCatalog[0].versions[simAppletCatalog[0].versions.length - 1]
  );
  const [scope, setScope] = useState<RegionScope>(initial?.scope ?? 'All Regions');
  const [autoAssign, setAutoAssign] = useState(initial?.autoAssign ?? true);

  const selectedApplet = useMemo(() => simAppletCatalog.find((a) => a.id === appletId) ?? simAppletCatalog[0], [appletId]);

  const handleAppletChange = (id: string) => {
    setAppletId(id);
    const catalogItem = simAppletCatalog.find((a) => a.id === id);
    if (catalogItem) setAppletVersion(catalogItem.versions[catalogItem.versions.length - 1]);
  };

  const canSave = oem.trim().length > 0 && model.trim().length > 0 && firmwareVersion.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const candidate = { deviceType, hardwareRevision, firmwareVersion: firmwareVersion.trim() };
    const conflict = findConflict(mappings, candidate, initial?.id);

    const mapping: DeviceMapping = {
      id: initial?.id ?? `DM-${String(mappings.length + 1).padStart(3, '0')}-${Date.now().toString(36).slice(-4)}`,
      deviceType,
      oem: oem.trim(),
      model: model.trim(),
      hardwareRevision,
      firmwareVersion: firmwareVersion.trim(),
      appletId,
      appletVersion,
      scope,
      devicesCovered: initial?.devicesCovered ?? 0,
      autoAssign,
      status: conflict ? 'Conflict' : autoAssign ? 'Active' : 'Draft',
    };

    onSave(mapping);
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTextBlock}>
            <h2 className={styles.title}>{mode === 'create' ? 'Create Mapping' : 'Edit Mapping'}</h2>
            <p className={styles.subtitle}>Configure the default SIM Applet assignment.</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onCancel} aria-label="Close">
            &times;
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>1. Device</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Device Type</label>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value as DeviceTypeName)}
                >
                  {DEVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <icons.chevronDownDark className={styles.selectChevron} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>OEM / Manufacturer</label>
              <input
                className={styles.input}
                value={oem}
                onChange={(e) => setOem(e.target.value)}
                placeholder="e.g. Landis+Gyr"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>OEM Model</label>
            <input
              className={styles.input}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. E360"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>2. Compatibility</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Hardware Revision</label>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={hardwareRevision}
                  onChange={(e) => setHardwareRevision(e.target.value)}
                >
                  {HARDWARE_REVISIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <icons.chevronDownDark className={styles.selectChevron} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Firmware Version</label>
              <input
                className={styles.input}
                value={firmwareVersion}
                onChange={(e) => setFirmwareVersion(e.target.value)}
                placeholder="e.g. FW 4.5.x"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>3. SIM Applet</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>SIM Applet</label>
              <div className={styles.selectWrap}>
                <select className={styles.select} value={appletId} onChange={(e) => handleAppletChange(e.target.value)}>
                  {simAppletCatalog.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <icons.chevronDownDark className={styles.selectChevron} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Default Applet Version</label>
              <div className={styles.selectWrap}>
                <select className={styles.select} value={appletVersion} onChange={(e) => setAppletVersion(e.target.value)}>
                  {selectedApplet.versions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <icons.chevronDownDark className={styles.selectChevron} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>4. Scope</h3>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Region / Provisioning Scope</label>
            <div className={styles.selectWrap}>
              <select className={styles.select} value={scope} onChange={(e) => setScope(e.target.value as RegionScope)}>
                {REGION_SCOPES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <icons.chevronDownDark className={styles.selectChevron} />
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} />
            Apply automatically during provisioning
          </label>
        </div>

        <div className={styles.infoBanner}>
          Matching devices will automatically inherit this Applet version. If another active mapping matches the same
          device, hardware and firmware combination, the system will flag a conflict before activation.
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.primaryButton} onClick={handleSave} disabled={!canSave}>
            {mode === 'create' ? 'Save Mapping' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

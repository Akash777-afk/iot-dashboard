import { useMemo, useState } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { FilterSelect } from '../../components/FilterSelect';
import { SearchInput } from '../../components/SearchInput';
import { CreateMappingModal } from '../../components/CreateMappingModal';
import { ConflictReviewModal } from '../../components/ConflictReviewModal';
import { icons } from '../../assets/icons';
import {
  defaultMappings,
  appletDisplayLabel,
  findConflict,
  MAPPING_STATUS_TONE,
  REGION_SCOPES,
  type DeviceMapping,
  type MappingStatus,
  type RegionScope,
} from '../../data/defaultMapping';
import styles from './DefaultMapping.module.css';

const statusOptions: Array<MappingStatus | 'All'> = ['All', 'Active', 'Draft', 'Conflict'];
const regionOptions: Array<RegionScope | 'All'> = ['All', ...REGION_SCOPES];

export function DefaultMappingContent() {
  const [mappings, setMappings] = useState<DeviceMapping[]>(defaultMappings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All');
  const [regionFilter, setRegionFilter] = useState<(typeof regionOptions)[number]>('All');

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeMapping, setActiveMapping] = useState<DeviceMapping | null>(null);
  const [conflictMapping, setConflictMapping] = useState<DeviceMapping | null>(null);

  const activeCount = mappings.filter((m) => m.status === 'Active').length;
  const totalDevices = mappings.reduce((sum, m) => sum + m.devicesCovered, 0);
  const coveredDevices = mappings.filter((m) => m.status === 'Active').reduce((sum, m) => sum + m.devicesCovered, 0);
  const coveragePct = totalDevices > 0 ? Math.round((coveredDevices / totalDevices) * 1000) / 10 : 0;

  const filteredMappings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mappings.filter((m) => {
      const matchesQuery =
        !query ||
        m.deviceType.toLowerCase().includes(query) ||
        m.oem.toLowerCase().includes(query) ||
        m.model.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchesRegion = regionFilter === 'All' || m.scope === regionFilter;
      return matchesQuery && matchesStatus && matchesRegion;
    });
  }, [mappings, search, statusFilter, regionFilter]);

  const exampleMapping = mappings.find((m) => m.status === 'Active') ?? mappings[0];

  const handleSaveMapping = (mapping: DeviceMapping) => {
    setMappings((prev) => {
      const exists = prev.some((m) => m.id === mapping.id);
      return exists ? prev.map((m) => (m.id === mapping.id ? mapping : m)) : [...prev, mapping];
    });
    setModalMode(null);
    setActiveMapping(null);
  };

  const handleDeactivateOther = (otherId: string) => {
    setMappings((prev) => {
      const withDeactivated = prev.map((m) =>
        m.id === otherId ? { ...m, status: 'Draft' as const, autoAssign: false } : m
      );
      return withDeactivated.map((m) => {
        if (m.status !== 'Conflict') return m;
        const stillConflicts = findConflict(withDeactivated, m, m.id);
        return stillConflicts ? m : { ...m, status: m.autoAssign ? 'Active' : 'Draft' };
      });
    });
    setConflictMapping(null);
  };

  return (
    <>
      <div className={styles.headerRow}>
        <div className={styles.headerTextBlock}>
          <h2 className={styles.title}>Default Mapping</h2>
          <p className={styles.subtitle}>
            Define which SIM Applet version should be assigned to each device configuration during provisioning.
          </p>
        </div>
        <button
          type="button"
          className={styles.createButton}
          onClick={() => {
            setModalMode('create');
            setActiveMapping(null);
          }}
        >
          <span className={styles.createPlus}>+</span> Create Mapping
        </button>
      </div>

      <div className={styles.statGrid}>
        <div className={`${styles.statCard} ${styles.statCardNeutral}`}>
          <div className={styles.statLabel}>Device Types Configured</div>
          <div className={styles.statValue}>{mappings.length}</div>
          <div className={styles.statCaption}>Configured device models</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statLabel}>Active Mappings</div>
          <div className={styles.statValue}>{activeCount}</div>
          <div className={styles.statCaption}>Currently applied rules</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statLabel}>Devices Covered</div>
          <div className={styles.statValue}>{coveredDevices.toLocaleString()}</div>
          <div className={styles.statCaption}>Matched by default mappings</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <div className={styles.statLabel}>Auto-Assignment Coverage</div>
          <div className={styles.statValue}>{coveragePct}%</div>
          <div className={styles.statCaption}>Provisioning coverage</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderTextBlock}>
            <h2 className={styles.cardTitle}>Device to SIM Applet Mappings</h2>
            <p className={styles.cardSubtitle}>Default rules used to assign an Applet version based on device compatibility.</p>
          </div>

          <div className={styles.toolbarControls}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search device type, OEM or model" />
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={statusOptions}
              onChange={(v) => setStatusFilter(v as (typeof statusOptions)[number])}
              showDot
            />
            <FilterSelect
              label="Region"
              value={regionFilter}
              options={regionOptions}
              onChange={(v) => setRegionFilter(v as (typeof regionOptions)[number])}
              icon={icons.deviceMonitor}
            />
            <StatusBadge label={`${activeCount} Active`} tone="green" />
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '23%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '6%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Device Type</th>
                <th>OEM / Model</th>
                <th>Hardware</th>
                <th>Firmware</th>
                <th>Default SIM Applet</th>
                <th>Scope</th>
                <th>Devices</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((m) => (
                <tr key={m.id} className={styles.row}>
                  <td className={styles.deviceTypeCell}>{m.deviceType}</td>
                  <td>
                    {m.oem} / {m.model}
                  </td>
                  <td>{m.hardwareRevision}</td>
                  <td>{m.firmwareVersion}</td>
                  <td>{appletDisplayLabel(m.appletId, m.appletVersion)}</td>
                  <td>{m.scope}</td>
                  <td>{m.devicesCovered.toLocaleString()}</td>
                  <td>
                    <StatusBadge label={m.status} tone={MAPPING_STATUS_TONE[m.status]} />
                  </td>
                  <td>
                    {m.status === 'Conflict' ? (
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => setConflictMapping(m)}
                        aria-label="Review conflict"
                      >
                        <icons.eye />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => {
                          setModalMode('edit');
                          setActiveMapping(m);
                        }}
                        aria-label="Edit mapping"
                      >
                        <icons.edit />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredMappings.length === 0 && (
                <tr>
                  <td colSpan={9} className={styles.emptyState}>
                    No mappings match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>How Default Mapping Works</h2>
        <p className={styles.cardSubtitle}>A device receives its default Applet based on the configured compatibility rule.</p>

        <div className={styles.flowGrid}>
          <div className={styles.flowStep}>
            <div className={styles.flowStepLabel}>IoT Device</div>
            <div className={styles.flowStepValue}>
              {exampleMapping.oem} {exampleMapping.model}
            </div>
          </div>
          <icons.chevronRight className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowStepLabel}>Hardware</div>
            <div className={styles.flowStepValue}>{exampleMapping.hardwareRevision}</div>
          </div>
          <icons.chevronRight className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowStepLabel}>Firmware</div>
            <div className={styles.flowStepValue}>{exampleMapping.firmwareVersion}</div>
          </div>
          <icons.chevronRight className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowStepLabel}>SIM Applet</div>
            <div className={styles.flowStepValue}>{exampleMapping.appletVersion}</div>
          </div>
          <icons.chevronRight className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowStepLabel}>Provisioning</div>
            <div className={styles.flowStepValue}>
              {exampleMapping.autoAssign ? 'Automatically assigned' : 'Manual assignment required'}
            </div>
          </div>
        </div>

        <div className={styles.ruleNote}>
          <strong>Provisioning rule:</strong> Devices matching the configured device type, hardware and firmware
          criteria automatically inherit the assigned SIM Applet version during provisioning.
        </div>
      </div>

      {modalMode && (
        <CreateMappingModal
          mode={modalMode}
          initial={activeMapping ?? undefined}
          mappings={mappings}
          onCancel={() => {
            setModalMode(null);
            setActiveMapping(null);
          }}
          onSave={handleSaveMapping}
        />
      )}

      {conflictMapping && (
        <ConflictReviewModal
          mapping={conflictMapping}
          mappings={mappings}
          onClose={() => setConflictMapping(null)}
          onEdit={(m) => {
            setConflictMapping(null);
            setModalMode('edit');
            setActiveMapping(m);
          }}
          onDeactivateOther={handleDeactivateOther}
        />
      )}
    </>
  );
}

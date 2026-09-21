import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import { securityDevices } from '../../data/security';
import styles from './Security.module.css';

export function SecurityContent() {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Security Status</h2>
        <p className={styles.cardSubtitle}>Click a device to open its detail and change status.</p>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Device</th>
            <th>IMEI</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {securityDevices.map((d) => (
            <tr key={d.deviceId} className={styles.row}>
              <td className={styles.deviceCell}>{d.deviceId}</td>
              <td>{d.imei}</td>
              <td>
                <StatusBadge label={d.status} tone={d.status === 'Whitelisted' ? 'green' : 'red'} />
              </td>
              <td className={styles.reasonCell}>{d.reason}</td>
              <td>
                <button
                  type="button"
                  className={styles.openButton}
                  onClick={() => navigate(`/devices/${d.deviceId}`, { state: { from: 'security' } })}
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

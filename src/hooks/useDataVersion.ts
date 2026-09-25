import { useEffect, useState } from 'react';
import { getDataVersion, subscribeDataChange } from '../data/devices';

/** Re-renders the calling component whenever the active dataset changes (e.g. a new Excel file is loaded). */
export function useDataVersion(): number {
  const [version, setVersion] = useState(getDataVersion());
  useEffect(() => subscribeDataChange(() => setVersion(getDataVersion())), []);
  return version;
}

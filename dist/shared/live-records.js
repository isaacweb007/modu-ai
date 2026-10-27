// Only record IDs/statuses are retained; address and phone stay in the current snapshot.
export function createRecordTracker(role, visitId = () => null) {
  let previous = null;
  return {
    reset() { previous = null; },
    scan(state) {
      const next = new Map(), changes = [];
      for (const kind of ['orders', 'reservations']) {
        for (const row of state[kind] || []) {
          if (role !== 'owner' && row.sessionId !== visitId()) continue;
          const key = `${kind}:${row.id}`;
          next.set(key, row.status);
          if (!previous) continue;
          if (role === 'owner' && !previous.has(key)) changes.push({key, kind, id:row.id, type:'new'});
          if (role !== 'owner' && previous.has(key) && previous.get(key) !== row.status) changes.push({key, kind, id:row.id, type:'status'});
        }
      }
      previous = next;
      return changes;
    }
  };
}
export const ORDER_STEPS = ['pending','accepted','preparing','ready','completed'];

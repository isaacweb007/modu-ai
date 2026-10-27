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
      for (const visit of state.sessions || []) {
        if (role !== 'owner' && visit.id !== visitId()) continue;
        for (const m of visit.thread || []) {
          if (m.interpretation?.direction !== (role === 'owner' ? 'guest' : 'owner')) continue;
          const key='interpretations:'+m.id;next.set(key,'delivered');
          if (previous && !previous.has(key)) changes.push({key,kind:'interpretations',id:m.id,sessionId:visit.id,type:'new'});
        }
      }
      previous = next;
      return changes;
    }
  };
}
export const ORDER_STEPS = ['pending','accepted','preparing','ready','completed'];

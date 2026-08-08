import { db, auth } from '../services/firebase';
import { doc, setDoc, deleteDoc, collection, getDocs, getDoc, writeBatch } from 'firebase/firestore';

const HISTORY_KEY = 'qrgen_history';
const DRAFTS_KEY = 'qrgen_drafts';
const PREFS_KEY = 'qrgen_preferences';
const MAX_HISTORY = 50;
const MAX_DRAFTS = 10;

export function saveToHistory(entry) {
  const history = getHistory();
  const existingIndex = entry.id ? history.findIndex(item => item.id === entry.id) : -1;
  
  const newEntry = {
    timestamp: new Date().toISOString(),
    ...entry,
    id: entry.id || (Date.now().toString(36) + Math.random().toString(36).substr(2)),
  };
  
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }
  
  history.unshift(newEntry);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'history', newEntry.id);
      setDoc(docRef, newEntry).catch(e => console.error('Firestore saveToHistory error:', e));
    }
  } catch (e) {
    console.error('Firestore saveToHistory error:', e);
  }

  return newEntry;
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteFromHistory(id) {
  const history = getHistory().filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'history', id);
      deleteDoc(docRef).catch(e => console.error('Firestore deleteFromHistory error:', e));
    }
  } catch (e) {
    console.error('Firestore deleteFromHistory error:', e);
  }

  return history;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const colRef = collection(db, 'users', user.uid, 'history');
      getDocs(colRef).then(snapshot => {
        const batch = writeBatch(db);
        snapshot.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      }).catch(e => console.error('Firestore clearHistory error:', e));
    }
  } catch (e) {
    console.error('Firestore clearHistory error:', e);
  }
}

export function clearHistoryByRange(hours) {
  if (hours === -1) {
    clearHistory();
    return [];
  }
  const history = getHistory();
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);
  const updated = history.filter(item => {
    const time = new Date(item.timestamp).getTime();
    return time < cutoff;
  });
  
  const toDelete = history.filter(item => {
    const time = new Date(item.timestamp).getTime();
    return time >= cutoff;
  });

  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user && toDelete.length > 0) {
      const batch = writeBatch(db);
      toDelete.forEach(item => {
        const docRef = doc(db, 'users', user.uid, 'history', item.id);
        batch.delete(docRef);
      });
      batch.commit().catch(e => console.error('Firestore clearHistoryByRange error:', e));
    }
  } catch (e) {
    console.error('Firestore clearHistoryByRange error:', e);
  }

  return updated;
}

const SAVED_KEY = 'qrgen_saved';
const MAX_SAVED = 100;

export function saveToSaved(entry) {
  const saved = getSaved();
  
  const entryToSave = {
    ...entry,
    id: entry.id || ('saved_' + Date.now().toString(36) + Math.random().toString(36).substr(2)),
    savedAt: new Date().toISOString()
  };

  const existingIndex = saved.findIndex(item => item.id === entryToSave.id);
  if (existingIndex !== -1) {
    saved.splice(existingIndex, 1);
  }
  
  saved.unshift(entryToSave);
  if (saved.length > MAX_SAVED) saved.pop();
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'saved', entryToSave.id);
      setDoc(docRef, entryToSave).catch(e => console.error('Firestore saveToSaved error:', e));
    }
  } catch (e) {
    console.error('Firestore saveToSaved error:', e);
  }

  return entryToSave;
}

export function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteFromSaved(id) {
  const saved = getSaved().filter(item => item.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'saved', id);
      deleteDoc(docRef).catch(e => console.error('Firestore deleteFromSaved error:', e));
    }
  } catch (e) {
    console.error('Firestore deleteFromSaved error:', e);
  }

  return saved;
}

export function clearSaved() {
  localStorage.removeItem(SAVED_KEY);

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const colRef = collection(db, 'users', user.uid, 'saved');
      getDocs(colRef).then(snapshot => {
        const batch = writeBatch(db);
        snapshot.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      }).catch(e => console.error('Firestore clearSaved error:', e));
    }
  } catch (e) {
    console.error('Firestore clearSaved error:', e);
  }
}

export function clearSavedByRange(hours) {
  if (hours === -1) {
    clearSaved();
    return [];
  }
  const saved = getSaved();
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);
  const updated = saved.filter(item => {
    const time = new Date(item.savedAt || item.timestamp).getTime();
    return time < cutoff;
  });

  const toDelete = saved.filter(item => {
    const time = new Date(item.savedAt || item.timestamp).getTime();
    return time >= cutoff;
  });

  localStorage.setItem(SAVED_KEY, JSON.stringify(updated));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user && toDelete.length > 0) {
      const batch = writeBatch(db);
      toDelete.forEach(item => {
        const docRef = doc(db, 'users', user.uid, 'saved', item.id);
        batch.delete(docRef);
      });
      batch.commit().catch(e => console.error('Firestore clearSavedByRange error:', e));
    }
  } catch (e) {
    console.error('Firestore clearSavedByRange error:', e);
  }

  return updated;
}

export function saveToDrafts(entry) {
  const drafts = getDrafts();
  const contentHash = JSON.stringify({ type: entry.qrType, data: entry.qrData });
  const filteredDrafts = drafts.filter(d => JSON.stringify({ type: d.qrType, data: d.qrData }) !== contentHash);
  
  const newEntry = {
    id: 'draft_' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    ...entry,
    isDraft: true
  };
  
  filteredDrafts.unshift(newEntry);
  if (filteredDrafts.length > MAX_DRAFTS) filteredDrafts.pop();
  
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(filteredDrafts));
  return newEntry;
}

export function getDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteFromDrafts(id) {
  const drafts = getDrafts().filter(item => item.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return drafts;
}

export function clearDrafts() {
  localStorage.removeItem(DRAFTS_KEY);
}

export function savePreferences(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

  // Firestore mirror sync
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'preferences', 'settings');
      setDoc(docRef, prefs).catch(e => console.error('Firestore savePreferences error:', e));
    }
  } catch (e) {
    console.error('Firestore savePreferences error:', e);
  }
}

export function getPreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    if (!prefs.saveLocation || prefs.saveLocation === 'Mushi QR Pro') {
      prefs.saveLocation = 'Pictures/Mushi QR Pro';
    }
    return prefs;
  } catch {
    return { saveLocation: 'Pictures/Mushi QR Pro' };
  }
}

export async function syncUserFirestoreData() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const historyColRef = collection(db, 'users', user.uid, 'history');
    const savedColRef = collection(db, 'users', user.uid, 'saved');
    const prefsDocRef = doc(db, 'users', user.uid, 'preferences', 'settings');

    // 1. Fetch from Firestore
    const [historySnapshot, savedSnapshot, prefsSnap] = await Promise.all([
      getDocs(historyColRef),
      getDocs(savedColRef),
      getDoc(prefsDocRef)
    ]);

    const dbHistory = [];
    historySnapshot.forEach(doc => dbHistory.push(doc.data()));

    const dbSaved = [];
    savedSnapshot.forEach(doc => dbSaved.push(doc.data()));

    // 2. Fetch from Local Storage
    const localHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const localSaved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');

    // 3. Merge History (latest timestamp wins)
    const historyMap = new Map();
    dbHistory.forEach(item => historyMap.set(item.id, item));
    localHistory.forEach(item => {
      const existing = historyMap.get(item.id);
      if (!existing || new Date(item.timestamp) > new Date(existing.timestamp)) {
        historyMap.set(item.id, item);
      }
    });
    const mergedHistory = Array.from(historyMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, MAX_HISTORY);

    // 4. Merge Saved (latest timestamp wins)
    const savedMap = new Map();
    dbSaved.forEach(item => savedMap.set(item.id, item));
    localSaved.forEach(item => {
      const existing = savedMap.get(item.id);
      const timeLocal = new Date(item.savedAt || item.timestamp).getTime();
      const timeExisting = existing ? new Date(existing.savedAt || existing.timestamp).getTime() : 0;
      if (!existing || timeLocal > timeExisting) {
        savedMap.set(item.id, item);
      }
    });
    const mergedSaved = Array.from(savedMap.values())
      .sort((a, b) => new Date(b.savedAt || b.timestamp) - new Date(a.savedAt || a.timestamp))
      .slice(0, MAX_SAVED);

    // 5. Update Local Storage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(mergedHistory));
    localStorage.setItem(SAVED_KEY, JSON.stringify(mergedSaved));

    // 6. Write back merged data to Firestore in a batch
    const batch = writeBatch(db);
    mergedHistory.forEach(item => {
      const docRef = doc(db, 'users', user.uid, 'history', item.id);
      batch.set(docRef, item);
    });
    mergedSaved.forEach(item => {
      const docRef = doc(db, 'users', user.uid, 'saved', item.id);
      batch.set(docRef, item);
    });
    await batch.commit();

    // 7. Sync Preferences
    if (prefsSnap.exists()) {
      const dbPrefs = prefsSnap.data();
      const localPrefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      const mergedPrefs = { ...localPrefs, ...dbPrefs };
      localStorage.setItem(PREFS_KEY, JSON.stringify(mergedPrefs));
      window.dispatchEvent(new Event('preferences-sync'));
    } else {
      const localPrefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      if (Object.keys(localPrefs).length > 0) {
        await setDoc(prefsDocRef, localPrefs);
      }
    }

    // 8. Trigger UI Refresh
    window.dispatchEvent(new Event('storage-sync'));
  } catch (err) {
    console.error('Failed to sync Firestore data:', err);
  }
}

export function handleLogoutClear() {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(SAVED_KEY);
  localStorage.removeItem(PREFS_KEY);
  window.dispatchEvent(new Event('storage-sync'));
  window.dispatchEvent(new Event('preferences-sync'));
}

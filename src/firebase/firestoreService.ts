import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    query, 
    orderBy, 
    serverTimestamp, 
    doc, 
    deleteDoc,
    Timestamp,
    setDoc,
    increment,
    limit
} from 'firebase/firestore';
import { db } from './config';
import { HistoryItem } from '../../types';

// The base path for all user history documents.
const HISTORY_COLLECTION = 'userHistory';

/**
 * Adds a new history item for a specific user and feature.
 * @param userId - The UID of the user.
 * @param featureId - The unique identifier for the feature (e.g., 'topic-explorer').
 * @param data - An object containing the user's input and the generated output.
 * @returns The saved history item with its new ID and server timestamp.
 */
export async function addHistory<T>(
  userId: string,
  featureId: string,
  data: { input: any; output: T }
): Promise<HistoryItem<T>> {
  const historyCollectionRef = collection(db, HISTORY_COLLECTION, userId, featureId);
  const timestamp = serverTimestamp();
  
  const docRef = await addDoc(historyCollectionRef, {
    ...data,
    timestamp,
  });

  return {
    id: docRef.id,
    timestamp: Timestamp.now(), // Use local timestamp for immediate UI update
    ...data
  } as HistoryItem<T>;
}

/**
 * Retrieves the history for a specific user and feature, ordered by most recent.
 * @param userId - The UID of the user.
 * @param featureId - The unique identifier for the feature.
 * @returns A promise that resolves to an array of history items.
 */
export async function getHistory<T>(
  userId: string,
  featureId: string
): Promise<HistoryItem<T>[]> {
  const historyCollectionRef = collection(db, HISTORY_COLLECTION, userId, featureId);
  const q = query(historyCollectionRef, orderBy('timestamp', 'desc'));
  
  const querySnapshot = await getDocs(q);
  
  const historyItems: HistoryItem<T>[] = [];
  querySnapshot.forEach((doc) => {
    historyItems.push({ id: doc.id, ...doc.data() } as HistoryItem<T>);
  });
  
  return historyItems;
}

/**
 * Deletes a specific history item from the database.
 * @param userId - The UID of the user.
 * @param featureId - The unique identifier for the feature.
 * @param docId - The ID of the document to delete.
 */
export async function deleteHistoryItem(
  userId: string,
  featureId: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, HISTORY_COLLECTION, userId, featureId, docId);
  await deleteDoc(docRef);
}

// --- Feature Flags & Broadcasts ---

/**
 * Fetches the current state of all feature flags.
 * @returns A promise that resolves to a Map where keys are feature IDs and values are booleans (isEnabled).
 */
export async function getFeatureFlags(): Promise<Map<string, boolean>> {
    const flagsCollectionRef = collection(db, 'featureFlags');
    const querySnapshot = await getDocs(flagsCollectionRef);
    const flags = new Map<string, boolean>();
    querySnapshot.forEach(doc => {
        flags.set(doc.id, doc.data().isEnabled);
    });
    return flags;
}

/**
 * Sets the enabled state of a specific feature. (Admin only)
 * @param featureId - The unique identifier for the feature.
 * @param isEnabled - The new state for the feature.
 */
export async function setFeatureFlag(featureId: string, isEnabled: boolean): Promise<void> {
    const flagDocRef = doc(db, 'featureFlags', featureId);
    await setDoc(flagDocRef, { isEnabled });
}

/**
 * Retrieves the site-wide broadcast message.
 * @returns A promise that resolves to the broadcast message object or null if not set.
 */
export async function getBroadcastMessage(): Promise<{ message: string; isActive: boolean } | null> {
    const configDocRef = doc(db, 'siteInfo', 'config');
    const docSnap = await getDoc(configDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            message: data.broadcastMessage || '',
            isActive: data.isBroadcastActive || false,
        };
    }
    return null;
}

/**
 * Sets the site-wide broadcast message. (Admin only)
 * @param broadcast - An object containing the message and its active state.
 */
export async function setBroadcastMessage({ message, isActive }: { message: string, isActive: boolean }): Promise<void> {
    const configDocRef = doc(db, 'siteInfo', 'config');
    await setDoc(configDocRef, { broadcastMessage: message, isBroadcastActive: isActive }, { merge: true });
}


/**
 * Retrieves statistics for the admin dashboard.
 * @returns A promise that resolves to an object with total invocations and unique tool count.
 */
interface AdminStats {
  totalInvocations: number;
  uniqueToolsCount: number;
}
export async function getAdminStats(): Promise<AdminStats> {
  const globalToolsCollectionRef = collection(db, 'globalToolUsage');
  const querySnapshot = await getDocs(globalToolsCollectionRef);
  
  let totalInvocations = 0;
  querySnapshot.forEach(doc => {
    totalInvocations += doc.data().count;
  });

  return {
    totalInvocations,
    uniqueToolsCount: querySnapshot.size
  };
}

/**
 * Retrieves all global tools usage, sorted by count.
 * @returns A promise that resolves to an array of all tools with their usage count.
 */
export async function getAllGlobalTools(): Promise<{id: string, count: number}[]> {
  const globalToolsCollectionRef = collection(db, 'globalToolUsage');
  const q = query(globalToolsCollectionRef, orderBy('count', 'desc'));
  const querySnapshot = await getDocs(q);
  const tools: {id: string, count: number}[] = [];
  querySnapshot.forEach(doc => {
    tools.push({ id: doc.id, count: doc.data().count });
  });
  return tools;
}

/**
 * Tracks usage of a tool for both the user and globally.
 * @param userId - The UID of the user.
 * @param featureId - The unique identifier for the feature.
 */
export async function trackToolUsage(userId: string, featureId: string): Promise<void> {
  // User-specific tracking
  const userToolRef = doc(db, 'toolUsage', userId, 'tools', featureId);
  await setDoc(userToolRef, { 
    count: increment(1), 
    lastUsed: serverTimestamp() 
  }, { merge: true });

  // Global tracking
  const globalToolRef = doc(db, 'globalToolUsage', featureId);
  await setDoc(globalToolRef, { 
    count: increment(1) 
  }, { merge: true });
}

/**
 * Retrieves the top used tools for a specific user.
 * @param userId - The UID of the user.
 * @param count - The number of top tools to retrieve.
 * @returns A promise that resolves to an array of top tools with their usage count.
 */
export async function getTopUserTools(userId: string, count = 5): Promise<{id: string, count: number}[]> {
  const toolsCollectionRef = collection(db, 'toolUsage', userId, 'tools');
  const q = query(toolsCollectionRef, orderBy('count', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);
  const tools: {id: string, count: number}[] = [];
  querySnapshot.forEach(doc => {
    tools.push({ id: doc.id, count: doc.data().count });
  });
  return tools;
}

/**
 * Retrieves the top used tools globally.
 * @param count - The number of top tools to retrieve.
 * @returns A promise that resolves to an array of top global tools with their usage count.
 */
export async function getTopGlobalTools(count = 5): Promise<{id: string, count: number}[]> {
  const globalToolsCollectionRef = collection(db, 'globalToolUsage');
  const q = query(globalToolsCollectionRef, orderBy('count', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);
  const tools: {id: string, count: number}[] = [];
  querySnapshot.forEach(doc => {
    tools.push({ id: doc.id, count: doc.data().count });
  });
  return tools;
}
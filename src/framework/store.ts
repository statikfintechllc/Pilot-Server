/**
 * Zero-dependency global store with event-based subscriptions
 * Provides immutable state updates and reactive subscriptions
 */

type Listener<T> = (state: T) => void;
type Unsubscribe = () => void;

export class Store<T extends Record<string, any>> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * Get current state snapshot
   */
  getState(): Readonly<T> {
    return { ...this.state };
  }

  /**
   * Update state immutably
   */
  setState(partial: Partial<T> | ((prevState: T) => Partial<T>)): void {
    const updates = typeof partial === 'function' ? partial(this.state) : partial;
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: Listener<T>): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all subscribers
   */
  private notify(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => listener(currentState));
  }

  /**
   * Reset to initial state
   */
  reset(newState: T): void {
    this.state = newState;
    this.notify();
  }
}

/**
 * Create a simple selector that derives values from state
 */
export function createSelector<T, R>(
  store: Store<T>,
  selector: (state: T) => R
): () => R {
  return () => selector(store.getState());
}

/**
 * Helper to create a derived store that automatically updates
 */
export function createDerivedStore<T, R>(
  sourceStore: Store<T>,
  transform: (state: T) => R
): Store<R> {
  const derived = new Store(transform(sourceStore.getState()));
  
  sourceStore.subscribe(state => {
    derived.setState(transform(state));
  });
  
  return derived;
}

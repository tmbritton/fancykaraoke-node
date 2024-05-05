export type Callback = (payload: any) => void

export interface Subscription {
  callback: Callback;
  priority: number;
}

type SubscriptionTypes = 'queueUpdated' | 'partyCreated';

type Dispatch = {type: SubscriptionTypes, payload: any}

/**
 * Publish events with a payload.
 * Accept subscriptions with a callback.
 */
const PubSub = (() => {

  const subscriptions: Record<string, Subscription[]> = {};
  const defaultPriority = 10;

  /**
   * Subscribe to a published event.
   * @param subscription
   */
  const subscribe = (type: SubscriptionTypes, callback: Callback, priority?: number): void => {
    const subscription: Subscription = {
      callback,
      priority: defaultPriority,
    };
        
    if (typeof priority === "number") {
      subscription.priority = priority;
    }
    if (!subscriptions[type]) {
      subscriptions[type] = [];
    }
    subscriptions[type].push(subscription);

    // Sort subscriptions by priority.
    subscriptions[type].sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      return 0;
    });
  };

  /**
   * Publish an event.
   * @param type Type of event.
   * @param payload
   */
  const publish = (type: SubscriptionTypes, payload?: Record<string, string>): void => {
    if (subscriptions.hasOwnProperty(type)) {
      subscriptions[type].forEach((subscription) => subscription.callback(payload));
    }
  };

  /**
   * Return all subscriptions.
   */
  const getSubscriptions = () => {
    return subscriptions;
  };

  /**
   * Remove a subscription.
   * @param type Type of subscription.
   * @param index Index of subscription in type array.
   */
  const removeSubscription = (type: string, index: number): void => {
    if (subscriptions[type]) {
      subscriptions[type].splice(index, 1);
    } else {
      throw new Error("There are no subscriptions of type: " + type);
    }
  };

  return {
    getSubscriptions,
    publish,
    removeSubscription,
    subscribe,
  };
})();

export default PubSub;

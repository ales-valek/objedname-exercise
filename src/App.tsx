import {
  type Component,
  createEffect,
  createResource,
  createSignal,
} from 'solid-js';

import { TimedOrderInput } from './components/form/TimedOrderInput';
import './index.css';

const fetchTimedOrderTimes = async (day: string | null) => {
  if (!day) return [];

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, 300);
  });
  const data = (await import('./mocks/timed-orders.json')).default;
  return data.Data.map(({ Time, Capacity, OriginalCapacity }) => ({
    time: Time,
    capacity: Capacity,
    originalCapacity: OriginalCapacity,
  }));
};

const App: Component = () => {
  const [timedOrderValue, setTimedOrderValue] = createSignal<{
    day: string | null;
    time: string | null;
  }>({
    day: null,
    time: null,
  });

  const selectedDay = () => timedOrderValue().day;

  const [timedOrderTimes] = createResource(selectedDay, fetchTimedOrderTimes);

  return (
    <div
      style={{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'min-height': '100vh',
        'background-color': '#444',
      }}
    >
      <TimedOrderInput
        days={['13.04.2024', '14.04.2024', '15.04.2024', '16.04.2024']}
        times={timedOrderTimes() ?? []}
        value={timedOrderValue()}
        onChange={(value) => setTimedOrderValue(value)}
        isLoading={timedOrderTimes.loading}
        errorMessage={timedOrderTimes.error?.message}
      />
    </div>
  );
};

export default App;

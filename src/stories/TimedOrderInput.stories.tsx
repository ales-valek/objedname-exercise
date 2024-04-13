import { TimedOrderInput } from '@/components/form/TimedOrderInput';
import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import timedOrderDataMock from '../mocks/timed-orders.json';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: 'Components/Form/Timed Order Input',
  render: (props) => {
    const [value, setValue] = createSignal({
      day: props.value?.day ?? null,
      time: props.value?.time ?? null,
    });

    return <TimedOrderInput {...props} value={value()} onChange={setValue} />;
  },
  tags: ['autodocs'],
  args: {
    days: ['13.4.2024', '14.4.2024', '15.4.2024', '16.4.2024', '17.4.2024'],
    times: [],
  },
} satisfies Meta<typeof TimedOrderInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const SelectedDay: Story = {
  args: {
    value: {
      day: '13.4.2024',
      time: null,
    },
    times: timedOrderDataMock.Data.map(
      ({ Time, Capacity, OriginalCapacity }) => ({
        time: Time,
        capacity: Capacity,
        originalCapacity: OriginalCapacity,
      }),
    ),
  },
};

export const SelectedTime: Story = {
  args: {
    value: {
      day: '15.4.2024',
      time: timedOrderDataMock.Data[3].Time,
    },
    times: timedOrderDataMock.Data.map(
      ({ Time, Capacity, OriginalCapacity }) => ({
        time: Time,
        capacity: Capacity,
        originalCapacity: OriginalCapacity,
      }),
    ),
  },
};

export const Loading: Story = {
  args: {
    value: {
      day: '13.4.2024',
    },
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    value: {
      day: '13.4.2024',
    },
    errorMessage: 'Při načítání časů nastala chyba.',
  },
};

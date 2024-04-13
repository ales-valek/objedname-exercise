import { ComponentProps, createSignal } from 'solid-js';
import { vitest } from 'vitest';

import { fireEvent, render } from '@solidjs/testing-library';

import { TimedOrderInput } from './TimedOrderInput';

it('Should render default message', () => {
  const { getByText } = render(() => (
    <TimedOrderInput
      days={[]}
      times={[]}
      onChange={() => {}}
      value={{ day: null, time: null }}
    />
  ));
  expect(getByText('Prosím, vyberte den.')).toBeInTheDocument();
});

it('Should correctly navigate between day pages, select / unselect days and select / unselect times', async () => {
  const [value, setValue] = createSignal<
    ComponentProps<typeof TimedOrderInput>['value']
  >({ day: null, time: null });
  const [times, setTimes] = createSignal<
    ComponentProps<typeof TimedOrderInput>['times']
  >([]);

  const onChange = vitest.fn((newValue) => {
    setValue(newValue);
    setTimes([
      { time: '9:00', capacity: 1, originalCapacity: 2 },
      { time: '10:00', capacity: 0, originalCapacity: 2 },
      { time: '11:00', capacity: 2, originalCapacity: 2 },
    ]);
  });

  const { getByText, getByTitle } = render(() => (
    <TimedOrderInput
      days={['14.4.2024', '15.4.2024', '16.4.2024', '17.4.2024']}
      times={times()}
      onChange={onChange}
      value={value()}
    />
  ));

  // Check if days are rendered
  const getPrevBtn = () => getByTitle('Předchozí dny');
  const getNextBtn = () => getByTitle('Následující dny');
  expect(getByText(new RegExp('14.4.'))).toBeInTheDocument();
  expect(getByText(new RegExp('15.4.'))).toBeInTheDocument();
  expect(getPrevBtn()).toHaveClass('-disabled');
  expect(getNextBtn()).not.toHaveClass('-disabled');

  // Check if its not possible to go below page 0
  fireEvent.click(getPrevBtn());
  expect(getByText(new RegExp('14.4.'))).toBeInTheDocument();
  expect(getByText(new RegExp('15.4.'))).toBeInTheDocument();

  // Change to the next days page
  fireEvent.click(getNextBtn());
  const getDayBtn = () => getByText(new RegExp('16.4.')).parentElement!;
  const getLastDayBtn = () => getByText(new RegExp('17.4.')).parentElement!;
  expect(getDayBtn()).toBeInTheDocument();
  expect(getLastDayBtn()).toBeInTheDocument();
  expect(getPrevBtn()).not.toHaveClass('-disabled');
  expect(getNextBtn()).toHaveClass('-disabled');

  // Check if its not possible to go above pages count
  fireEvent.click(getNextBtn());
  expect(getNextBtn()).toBeInTheDocument();
  expect(getLastDayBtn()).toBeInTheDocument();

  // Select day
  fireEvent.click(getDayBtn());
  expect(onChange).toHaveBeenCalledWith({ day: '16.4.2024', time: null });
  expect(getDayBtn()).toHaveClass('-active');

  // Unselect day by clicking on the same day
  fireEvent.click(getDayBtn());
  expect(onChange).toHaveBeenCalledWith({ day: null, time: null });
  expect(getDayBtn()).not.toHaveClass('-active');

  // Select day
  fireEvent.click(getDayBtn());
  expect(onChange).toHaveBeenCalledWith({ day: '16.4.2024', time: null });

  // Check if times are rendered
  const getTimeBtn = () => getByText('11:00').parentElement!;
  const getDisabledTimeBtn = () => getByText('10:00').parentElement;
  expect(getByText('9:00').parentElement).toBeInTheDocument();
  expect(getDisabledTimeBtn()).toBeInTheDocument();
  expect(getTimeBtn()).toBeInTheDocument();
  expect(getDisabledTimeBtn()).toHaveClass('-disabled');

  // Select time
  fireEvent.click(getTimeBtn());
  expect(onChange).toHaveBeenCalledWith({ day: '16.4.2024', time: '11:00' });
  expect(getTimeBtn()).toHaveClass('-active');

  // Unselect time by clicking on the same time
  fireEvent.click(getTimeBtn());
  expect(onChange).toHaveBeenCalledWith({ day: '16.4.2024', time: null });
  expect(getTimeBtn()).not.toHaveClass('-active');

  // Select time again
  fireEvent.click(getTimeBtn());
  expect(onChange).toHaveBeenCalledWith({ day: '16.4.2024', time: '11:00' });

  // Unselect time by changing day
  fireEvent.click(getLastDayBtn());
  expect(onChange).toHaveBeenCalledWith({ day: '17.4.2024', time: null });
});

it('Should show loading', () => {
  const { getByLabelText } = render(() => (
    <TimedOrderInput
      days={[]}
      times={[]}
      onChange={() => {}}
      value={{ day: '14.4.2024', time: null }}
      isLoading={true}
    />
  ));
  expect(getByLabelText('Loading...')).toBeInTheDocument();
});

it('Should show error message', () => {
  const { getByText } = render(() => (
    <TimedOrderInput
      days={['14.4.2024', '15.4.2024', '16.4.2024']}
      times={[]}
      onChange={() => {}}
      value={{ day: '14.4.2024', time: null }}
      errorMessage="Error message"
    />
  ));
  expect(getByText('Error message')).toBeInTheDocument();
});

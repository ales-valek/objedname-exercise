import clsx from 'clsx';
import { Component, For, Match, Switch, createSignal } from 'solid-js';

import Spinner from '@/assets/svg/spinner.svg';
import { formatDate } from '@/utils/formatDate';

import styles from './TimedOrderInput.module.css';

type Times = {
  /**
   * Time
   * @example
   * "9:15" | "12:30"
   */
  time: string;
  /** Current free capacity for the time */
  capacity: number;
  /** Original maximum capacity for the time */
  originalCapacity: number;
}[];

type TimedOrderValue = {
  /**
   * Selected day
   * @example
   * "12.9.2023"
   */
  day: string | null;
  /**
   * Selected time
   * @example
   * "09:15" | "12:30"
   */
  time: string | null;
};

type SelectDayProps = {
  /** Available days */
  days: string[];
  /**
   * Selected day
   * @example
   * "12.9.2023"
   */
  selectedDay: TimedOrderValue['day'];
  /** Callback function to be called after day selection */
  onSelect: (value: TimedOrderValue['day']) => void;
};

export const SelectDay: Component<SelectDayProps> = (props) => {
  const limit = 2;
  const [page, setPage] = createSignal(
    props.selectedDay
      ? Math.round(
          props.days.findIndex((day) => day === props.selectedDay) / limit,
        )
      : 0,
  );

  const lastPage = () => Math.round(props.days.length / limit) - 1;

  const days = () => {
    return props.days.slice(page() * limit, page() * limit + limit);
  };

  const activeDayIndex = () =>
    days().findIndex((day) => day === props.selectedDay);

  const handleSelect = (day: string, index: number) => {
    props.onSelect(activeDayIndex() === index ? null : day);
  };

  const handleChangePage = (page: number) => {
    if (page < 0) return;
    if (page > lastPage()) {
      return setPage(lastPage());
    }
    return setPage(page);
  };

  return (
    <div class={styles['day-row']}>
      <div
        class={clsx(styles['prev-btn'], page() - 1 < 0 && '-disabled')}
        onClick={() => handleChangePage(page() - 1)}
        title="Předchozí dny"
      >
        <img src="https://objedname.eu/ui/system/icons/white/arrow_left.svg" />
      </div>
      <div class={styles['day-container']}>
        <For each={days()}>
          {(day, index) => {
            return (
              <div
                class={clsx(
                  styles['day-btn'],
                  activeDayIndex() === index() && '-active',
                )}
                onClick={() => handleSelect(day, index())}
              >
                <h4>{formatDate(day)}</h4>
              </div>
            );
          }}
        </For>
      </div>
      <div
        class={clsx(styles['next-btn'], page() + 1 > lastPage() && '-disabled')}
        onClick={() => handleChangePage(page() + 1)}
        title="Následující dny"
      >
        <img src="https://objedname.eu/ui/system/icons/white/arrow_right.svg" />
      </div>
    </div>
  );
};

type SelectTimeProps = {
  /** Available times for the selected day */
  times: Times;
  /**
   * Selected time
   * @example
   * "9:15" | "12:30"
   */
  selectedTime: TimedOrderValue['time'];
  /** Callback function to be called after time selection */
  onSelect: (value: TimedOrderValue['time']) => void;
};

export const SelectTime: Component<SelectTimeProps> = (props) => {
  const activeTimeIndex = () =>
    props.times.findIndex(({ time }) => time === props.selectedTime);

  const handleSelect = (time: string, index: number) => {
    props.onSelect(activeTimeIndex() === index ? null : time);
  };

  return (
    <div class={styles['time-container']}>
      <For each={props.times}>
        {({ time, capacity, originalCapacity }, index) => (
          <div
            class={clsx(
              styles['time-btn'],
              capacity === 0 && '-disabled',
              activeTimeIndex() === index() && '-active',
            )}
            onClick={() => handleSelect(time, index())}
          >
            <span class={styles['time-btn-capacity']}>
              (
              {originalCapacity -
                capacity +
                (activeTimeIndex() === index() ? 1 : 0)}
              /{originalCapacity})
            </span>
            <span>{time}</span>
          </div>
        )}
      </For>
    </div>
  );
};

type TimedOrderInputProps = {
  /** Available days */
  days: string[];
  /** Available times for selected day */
  times: Times;
  /** Current timed order input value */
  value: TimedOrderValue;
  /** Callback function to be called after value change */
  onChange: (value: { day: string | null; time: string | null }) => void;
  /** Is data for times loading */
  isLoading?: boolean;
  /**
   * Error message to be shown if some error happen.
   *
   * If defined, times won't be shown.
   * */
  errorMessage?: string;
};

export const TimedOrderInput: Component<TimedOrderInputProps> = (props) => {
  return (
    <div class={styles.wrapper}>
      <SelectDay
        days={props.days}
        selectedDay={props.value.day}
        onSelect={(day) => props.onChange({ time: null, day })}
      />
      <Switch>
        <Match when={!props.value.day}>
          <div class={styles['loading']}>Prosím, vyberte den.</div>
        </Match>
        <Match when={props.isLoading}>
          <div class={styles['loading']}>
            <Spinner aria-label="Loading..." />
          </div>
        </Match>
        <Match when={props.errorMessage}>
          <div class={styles['error-message']}>{props.errorMessage}</div>
        </Match>
        <Match when={props.value.day}>
          <SelectTime
            times={props.times}
            selectedTime={props.value.time}
            onSelect={(time) => props.onChange({ ...props.value, time })}
          />
        </Match>
      </Switch>
    </div>
  );
};

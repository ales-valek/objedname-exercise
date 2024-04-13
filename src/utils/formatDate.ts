import { capitalize } from './capitalize';

export const formatDate = (dateString: string) => {
  const locale = 'cs'; // window.navigator.language;
  const intl = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const [day, month, year] = dateString.split('.');
  const date = new Date(`${month} ${day} ${year}`);
  const today = new Date();

  const formattedDate = date
    .toLocaleDateString('cs', { day: 'numeric', month: 'numeric' })
    .replace(' ', '');

  const isToday =
    new Date(date.getDate(), date.getMonth(), date.getFullYear()).getTime() ===
    new Date(today.getDate(), today.getMonth(), today.getFullYear()).getTime();

  if (isToday) {
    const todayText = capitalize(intl.format(0, 'day'));
    return `${todayText} ${formattedDate}`;
  }

  const isTomorrow =
    new Date(date.getDate(), date.getMonth(), date.getFullYear()).getTime() ===
    new Date(
      today.getDate() + 1,
      today.getMonth(),
      today.getFullYear(),
    ).getTime();

  if (isTomorrow) {
    const tomorrowText = capitalize(intl.format(1, 'day'));
    return `${tomorrowText} ${formattedDate}`;
  }

  const dayName = capitalize(
    date.toLocaleDateString(locale, { weekday: 'short' }),
  );

  return `${dayName} ${formattedDate}`;
};

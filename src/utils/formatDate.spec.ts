import { formatDate } from './formatDate';

const today = new Date();

it('Should format for today', () => {
  expect(
    formatDate(
      `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`,
    ),
  ).toBe(`Dnes ${today.getDate()}.${today.getMonth() + 1}.`);
});

it('Should format for tomorrow', () => {
  expect(
    formatDate(
      `${today.getDate() + 1}.${today.getMonth() + 1}.${today.getFullYear()}`,
    ),
  ).toBe(`Zítra ${today.getDate() + 1}.${today.getMonth() + 1}.`);
});

it('Should format for another day', () => {
  expect(formatDate('19.4.2010')).toBe('Po 19.4.');
  expect(formatDate('20.4.2010')).toBe('Út 20.4.');
  expect(formatDate('21.4.2010')).toBe('St 21.4.');
  expect(formatDate('22.4.2010')).toBe('Čt 22.4.');
  expect(formatDate('23.4.2010')).toBe('Pá 23.4.');
  expect(formatDate('24.4.2010')).toBe('So 24.4.');
  expect(formatDate('25.4.2010')).toBe('Ne 25.4.');
});

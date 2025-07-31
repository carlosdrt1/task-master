import { zeroTimeDate } from './date.util';

describe('DateUtil', () => {
  it('should clear the time of a date passed', () => {
    const date = new Date();
    const result = zeroTimeDate(date);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});

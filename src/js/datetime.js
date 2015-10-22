const HOUR     = 60 * 60 * 1000;
const DAY      = HOUR * 24;
const WEEK     = DAY * 7;
const MONTH    = DAY * 30;
const HALFYEAR = MONTH * 6;
const YEAR     = DAY * 365;

export default class DateTime {
  static get HOUR() {
    return HOUR;
  }
  static get DAY() {
    return DAY;
  }
  static get WEEK() {
    return WEEK;
  }
  static get MONTH() {
    return MONTH;
  }
  static get HALFYEAR() {
    return HALFYEAR;
  }
  static get YEAR() {
    return YEAR;
  }
}

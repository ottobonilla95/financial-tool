type DatedRecord = {
  date: Date;
};

export function filterRecordsThroughDay<T extends DatedRecord>(
  records: T[],
  dayOfMonth: number
) {
  return records.filter((record) => record.date.getUTCDate() <= dayOfMonth);
}

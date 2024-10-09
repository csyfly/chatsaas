export type TimeSelection = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  preset: "today" | "tomorrow" | "yesterday" | "thisWeek" | "lastWeek" | "nextWeek" 
    | "thisMonth" | "lastMonth" | "nextMonth" | "thisQuarter" | "lastQuarter" | "nextQuarter"
    | "thisYear" | "lastYear" | "nextYear" | null;
};

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { TimeSelection } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 添加一个新的函数来格式化日期
export const formatDeadline = (deadline: Date | null ): string => {
  if (!deadline) return "";
  return formatDate(deadline);
};

export const isOverdue = (deadline: Date | null): boolean => {
  if (!deadline) return false;
  const now = new Date();
  const diffTime = now.getTime() - deadline.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 1;
};

 // 修改这个函数来格式化日期
export const formatDate = (date: Date | null) => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// 判断给定日期是否在一年以上
export const isMoreThanOneYear = (date: Date): boolean => {
  const now = new Date();
  const oneYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  return date < oneYear;
};

// 判断是否为长期目标（截止时间在1年后）
export const isLongTermGoal = (deadline: Date): boolean => {
  if (!deadline) return false;
  const now = new Date();
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  return deadline > oneYearFromNow;
};

// 判断给定日期是否在preset的时间范围内
export function isWithinTimeRange(
  date: Date | null, 
  timeSelection: TimeSelection
): boolean {
  if (!date) return true;

  if (timeSelection.preset) {
    const { startDate, endDate } = getTimeRange(timeSelection);
    return date >= startDate && date <= endDate;
  } else if (timeSelection.startDate && timeSelection.endDate) {
    // 判断日期是否在指定的日期范围内
    return date >= timeSelection.startDate && date <= timeSelection.endDate;
  }
  return true; // 如果没有设置任何过滤条件,返回true
}

// 根据preset获取时间范围
export function getTimeRange(timeSelection: TimeSelection): { startDate: Date, endDate: Date } {  
  const today = new Date();
  let start = new Date();
  let end = new Date();

    switch (timeSelection.preset) {
      case 'today':
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'tomorrow':
        start = new Date(today.setDate(today.getDate() + 1));
        start.setHours(0,0,0,0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start = new Date(today.setDate(today.getDate() - 1));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        start.setDate(today.getDate() - today.getDay());
        start.setHours(0,0,0,0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'lastWeek':
        start.setDate(today.getDate() - today.getDay() - 7);
        start.setHours(0,0,0,0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'nextWeek':
        start.setDate(today.getDate() - today.getDay() + 7);
        start.setHours(0,0,0,0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisMonth':
        start.setDate(1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'nextMonth':
        start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'lastQuarter':
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        start = new Date(today.getFullYear(), lastQuarter * 3, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), (lastQuarter + 1) * 3, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'nextQuarter':
        const nextQuarter = Math.floor(today.getMonth() / 3) + 1;
        start = new Date(today.getFullYear(), nextQuarter * 3, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), (nextQuarter + 1) * 3, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      case 'lastYear':
        start = new Date(today.getFullYear() - 1, 0, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear() - 1, 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      case 'nextYear':
        start = new Date(today.getFullYear() + 1, 0, 1);
        start.setHours(0,0,0,0);
        end = new Date(today.getFullYear() + 1, 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = timeSelection.startDate || today; 
        start.setHours(0, 0, 0, 0);
        end = timeSelection.endDate || today;
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { startDate: start, endDate: end };
}
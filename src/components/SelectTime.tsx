'use client'
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { TimeSelection } from '@/lib/types';
import { getTimeRange } from '@/lib/utils';

interface SelectTimeProps {
  initialTimeSelection?: TimeSelection;
  onTimeSelectionChange?: (selection: TimeSelection) => void;
}

const presetRanges = [
  [
    { label: 'today', type: 'today' },
    { label: 'yesterday', type: 'yesterday' },
    { label: 'tomorrow', type: 'tomorrow' },
  ],
  [
    { label: 'thisWeek', type: 'thisWeek' },
    { label: 'lastWeek', type: 'lastWeek' },
    { label: 'nextWeek', type: 'nextWeek' },
  ],
  [
    { label: 'thisMonth', type: 'thisMonth' },
    { label: 'lastMonth', type: 'lastMonth' },
    { label: 'nextMonth', type: 'nextMonth' },
  ],
  [
    { label: 'thisQuarter', type: 'thisQuarter' },
    { label: 'lastQuarter', type: 'lastQuarter' },
    { label: 'nextQuarter', type: 'nextQuarter' },
  ],
  [
    { label: 'thisYear', type: 'thisYear' },
    { label: 'lastYear', type: 'lastYear' },
    { label: 'nextYear', type: 'nextYear' },
  ],
];

const SelectTime: React.FC<SelectTimeProps> = ({ initialTimeSelection, onTimeSelectionChange }) => {
  const [timeSelection, setTimeSelection] = useState<TimeSelection>(
    initialTimeSelection || {
      startDate: undefined,
      endDate: undefined,
      preset: "thisMonth"
    }
  );
  const [open, setOpen] = useState(false);

  const handleRangeSelect = (range: { from: Date; to: Date }) => {
    const newSelection = {
      startDate: range.from,
      endDate: range.to,
      preset: null
    };
    setTimeSelection(newSelection);
    onTimeSelectionChange?.(newSelection);
    //setOpen(false);
  };

  const handlePresetSelect = (preset: { label: string; type: string }) => {
    const timeSelection: TimeSelection = {
      startDate: undefined,
      endDate: undefined,
      preset: preset.type as TimeSelection['preset']
    }
    const { startDate, endDate } = getTimeRange(timeSelection);

    const newSelection = {
      startDate: startDate,
      endDate: endDate,
      preset: preset.type as TimeSelection['preset']
    };
    setTimeSelection(newSelection);
    onTimeSelectionChange?.(newSelection);
    //setOpen(false);
  };

  const getDisplayText = () => {
    if (timeSelection.preset) {
      return timeSelection.preset;
    }
    if (timeSelection.startDate && timeSelection.endDate) {
      return `${format(timeSelection.startDate, 'yyyy-MM-dd')} to ${format(timeSelection.endDate, 'yyyy-MM-dd')}`;
    }
    return 'SelectTime';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="px-2 py-0 h-6">
          {getDisplayText()}
          <ChevronDown className="ml-0 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="p-4 border-r">
            <div className="grid gap-1">
              {presetRanges.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1">
                  {row.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      onClick={() => handlePresetSelect(preset)}
                      className="justify-start h-8 px-2 text-gray-500"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <Calendar
              mode="range"
              selected={{ from: timeSelection.startDate, to: timeSelection.endDate }}
              onSelect={(range: DateRange | undefined) => {
                if (range?.from && range?.to) {
                  handleRangeSelect({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectTime;

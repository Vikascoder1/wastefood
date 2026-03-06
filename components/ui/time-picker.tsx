"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  selectedDate?: string // Add selected date for validation
}

export function TimePicker({ 
  value, 
  onChange, 
  placeholder = "Select time",
  className,
  disabled = false,
  selectedDate
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<number>(12)
  const [selectedMinute, setSelectedMinute] = React.useState<number>(0)
  const [isAM, setIsAM] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number)
      setSelectedHour(hours % 12 || 12)
      setSelectedMinute(minutes)
      setIsAM(hours < 12)
    }
  }, [value])

  const handleTimeChange = (hour: number, minute: number, am: boolean) => {
    const adjustedHour = am ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12)
    const timeString = `${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    onChange?.(timeString)
  }

  const formatDisplayTime = () => {
    if (!value) return placeholder
    const [hours, minutes] = value.split(':').map(Number)
    const displayHour = hours % 12 || 12
    const ampm = hours < 12 ? 'AM' : 'PM'
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // Check if a time is in the past
  const isTimeInPast = (hour: number, minute: number, am: boolean) => {
    if (!selectedDate) return false
    
    const now = new Date()
    const selectedDateTime = new Date(selectedDate)
    
    // Set the time for the selected date
    const adjustedHour = am ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12)
    selectedDateTime.setHours(adjustedHour, minute, 0, 0)
    
    return selectedDateTime <= now
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {/* Hours */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Hour</Label>
              <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                {hours.map((hour) => {
                  const isPast = isTimeInPast(hour, selectedMinute, isAM)
                  return (
                    <Button
                      key={hour}
                      variant={selectedHour === hour ? "default" : "ghost"}
                      size="sm"
                      className="h-8 text-xs"
                      disabled={isPast}
                      onClick={() => {
                        setSelectedHour(hour)
                        handleTimeChange(hour, selectedMinute, isAM)
                      }}
                    >
                      {hour}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Minutes */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Minute</Label>
              <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                {minutes.map((minute) => {
                  const isPast = isTimeInPast(selectedHour, minute, isAM)
                  return (
                    <Button
                      key={minute}
                      variant={selectedMinute === minute ? "default" : "ghost"}
                      size="sm"
                      className="h-8 text-xs"
                      disabled={isPast}
                      onClick={() => {
                        setSelectedMinute(minute)
                        handleTimeChange(selectedHour, minute, isAM)
                      }}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* AM/PM */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">AM/PM</Label>
              <div className="grid grid-cols-1 gap-1">
                <Button
                  variant={isAM ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs"
                  disabled={isTimeInPast(selectedHour, selectedMinute, true)}
                  onClick={() => {
                    setIsAM(true)
                    handleTimeChange(selectedHour, selectedMinute, true)
                  }}
                >
                  AM
                </Button>
                <Button
                  variant={!isAM ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs"
                  disabled={isTimeInPast(selectedHour, selectedMinute, false)}
                  onClick={() => {
                    setIsAM(false)
                    handleTimeChange(selectedHour, selectedMinute, false)
                  }}
                >
                  PM
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

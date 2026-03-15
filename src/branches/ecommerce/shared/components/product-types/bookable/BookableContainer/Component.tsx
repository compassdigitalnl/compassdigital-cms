'use client'

import { useState, useCallback, useMemo } from 'react'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/shared/components/ui/AddToCartToast'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { BookingCalendar } from '../BookingCalendar'
import { TimeSlotSelector } from '../TimeSlotSelector'
import { ParticipantSelector } from '../ParticipantSelector'
import { DurationSelector } from '../DurationSelector'
import { BookingSummaryCard } from '../BookingSummaryCard'
import { BookingAvailabilityStatus } from '../BookingAvailabilityStatus'
import { AddOnSelector } from '../AddOnSelector'
import type {
  BookableContainerProps,
  BookableConfig,
  RawDurationOption,
  RawTimeSlot,
  RawParticipantCategory,
  RawAddOn,
} from './types'
import type { DayAvailability } from '../BookingCalendar'

export function BookableContainer({ product, className = '' }: BookableContainerProps) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const { formatPriceStr } = usePriceMode()

  // Parse booking config from product data
  const config = useMemo<BookableConfig>(() => {
    const raw = (product as unknown as { bookableConfig?: BookableConfig }).bookableConfig
    return raw || {}
  }, [product])

  // Duration options
  const durationOptions = useMemo(() => {
    if (!Array.isArray(config.durationOptions) || config.durationOptions.length === 0) return []
    return config.durationOptions.map((opt: RawDurationOption, i: number) => ({
      id: opt.id || String(i),
      duration: Number(opt.duration) || 60,
      label: opt.label || `${opt.duration} minuten`,
      description: opt.description || undefined,
      price: Number(opt.price) || 0,
      popular: opt.popular === true,
    }))
  }, [config.durationOptions])

  // Time slots
  const timeSlots = useMemo(() => {
    if (!Array.isArray(config.timeSlots) || config.timeSlots.length === 0) return []
    return config.timeSlots.map((slot: RawTimeSlot, i: number) => ({
      id: slot.id || String(i),
      time: slot.time || '',
      available: slot.available !== false,
      spotsLeft: slot.spotsLeft != null ? Number(slot.spotsLeft) : undefined,
      price: slot.priceOverride != null ? Number(slot.priceOverride) : undefined,
    }))
  }, [config.timeSlots])

  // Participant categories
  const participantCategories = useMemo(() => {
    if (!Array.isArray(config.participantCategories) || config.participantCategories.length === 0) return []
    return config.participantCategories.map((cat: RawParticipantCategory, i: number) => ({
      id: cat.id || String(i),
      label: cat.label || '',
      description: cat.description || undefined,
      price: Number(cat.price) || 0,
      minCount: cat.minCount != null ? Number(cat.minCount) : 0,
      maxCount: cat.maxCount != null ? Number(cat.maxCount) : undefined,
      count: cat.minCount != null ? Number(cat.minCount) : 0,
    }))
  }, [config.participantCategories])

  // Add-ons
  const addOnsConfig = useMemo(() => {
    if (!Array.isArray(config.addOns) || config.addOns.length === 0) return []
    return config.addOns.map((addon: RawAddOn, i: number) => ({
      id: addon.id || String(i),
      label: addon.label || '',
      description: addon.description || undefined,
      price: Number(addon.price) || 0,
      required: addon.required === true,
      selected: addon.required === true,
    }))
  }, [config.addOns])

  // State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined)
  const [selectedDurationId, setSelectedDurationId] = useState<string | undefined>(
    durationOptions.length === 1 ? durationOptions[0].id : undefined,
  )
  const [participants, setParticipants] = useState(() => participantCategories)
  const [addOns, setAddOns] = useState(() => addOnsConfig)

  // Availability status
  const availabilityStatus = useMemo(() => {
    const totalCapacity = config.totalCapacity || 0
    const availableSlots = timeSlots.filter((s) => s.available)
    if (availableSlots.length === 0 && timeSlots.length > 0) return 'full' as const
    if (totalCapacity > 0 && totalCapacity <= 3) return 'limited' as const
    return 'available' as const
  }, [config.totalCapacity, timeSlots])

  // Calendar availability (simplified — generate from time slots)
  const calendarAvailability = useMemo<DayAvailability[]>(() => {
    // If no time slots configured, show next 30 days as available
    if (timeSlots.length === 0) return []
    const days: DayAvailability[] = []
    const today = new Date()
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const hasAvailable = timeSlots.some((s) => s.available)
      const basePrice = Number(product.price) || 0
      days.push({
        date,
        available: hasAvailable && date.getDay() !== 0, // closed on Sundays
        price: config.showPricesOnCalendar ? basePrice : undefined,
        spotsLeft: config.totalCapacity || undefined,
      })
    }
    return days
  }, [timeSlots, product.price, config.showPricesOnCalendar, config.totalCapacity])

  // Handle participant count change
  const handleParticipantChange = useCallback((categoryId: string, count: number) => {
    setParticipants((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, count } : cat)),
    )
  }, [])

  // Handle add-on toggle
  const handleAddOnChange = useCallback((addOnId: string, selected: boolean) => {
    setAddOns((prev) =>
      prev.map((addon) => {
        if (addon.id === addOnId && !addon.required) {
          return { ...addon, selected }
        }
        return addon
      }),
    )
  }, [])

  // Price calculation
  const totalPrice = useMemo(() => {
    const basePrice = Number(product.salePrice || product.price) || 0

    // Duration price (replaces base price if set)
    const selectedDuration = durationOptions.find((d) => d.id === selectedDurationId)
    const durationPrice = selectedDuration ? selectedDuration.price : basePrice

    // Slot price override
    const selectedSlot = timeSlots.find((s) => s.id === selectedSlotId)
    const slotPrice = selectedSlot?.price != null ? selectedSlot.price : 0

    // Participant costs
    const participantCost = participants.reduce(
      (sum, cat) => sum + cat.price * cat.count,
      0,
    )

    // Add-on costs
    const addOnCost = addOns
      .filter((a) => a.selected)
      .reduce((sum, a) => sum + a.price, 0)

    // If participant categories exist, use participant pricing instead of base
    if (participants.length > 0 && participants.some((p) => p.count > 0)) {
      return participantCost + slotPrice + addOnCost
    }

    return durationPrice + slotPrice + addOnCost
  }, [product, durationOptions, selectedDurationId, timeSlots, selectedSlotId, participants, addOns])

  // Total participants
  const totalParticipants = participants.reduce((sum, cat) => sum + cat.count, 0)

  // Is booking complete?
  const isComplete = useMemo(() => {
    if (timeSlots.length > 0 && !selectedSlotId) return false
    if (durationOptions.length > 0 && !selectedDurationId) return false
    if (participants.length > 0 && totalParticipants === 0) return false
    return true
  }, [timeSlots, selectedSlotId, durationOptions, selectedDurationId, participants, totalParticipants])

  // Build summary
  const summary = useMemo(() => {
    const selectedSlot = timeSlots.find((s) => s.id === selectedSlotId)
    const selectedDuration = durationOptions.find((d) => d.id === selectedDurationId)

    return {
      date: selectedDate || undefined,
      time: selectedSlot?.time || undefined,
      duration: selectedDuration?.label || undefined,
      participants: participants
        .filter((p) => p.count > 0)
        .map((p) => ({ category: p.label, count: p.count, price: p.price })),
      addOns: addOns
        .filter((a) => a.selected)
        .map((a) => ({ label: a.label, price: a.price })),
      basePrice: Number(product.salePrice || product.price) || 0,
      totalPrice,
    }
  }, [selectedDate, timeSlots, selectedSlotId, durationOptions, selectedDurationId, participants, addOns, product, totalPrice])

  // Add to cart
  const handleBook = useCallback(() => {
    if (!isComplete) return

    const selectedSlot = timeSlots.find((s) => s.id === selectedSlotId)
    const selectedDuration = durationOptions.find((d) => d.id === selectedDurationId)

    const bookingSummary = [
      selectedDate ? selectedDate.toLocaleDateString('nl-NL') : '',
      selectedSlot?.time || '',
      selectedDuration?.label || '',
      ...participants.filter((p) => p.count > 0).map((p) => `${p.count}x ${p.label}`),
      ...addOns.filter((a) => a.selected).map((a) => a.label),
    ]
      .filter(Boolean)
      .join(' | ')

    addItem({
      product,
      quantity: 1,
      booking: {
        date: selectedDate?.toISOString(),
        time: selectedSlot?.time,
        duration: selectedDuration?.label,
        participants: participants.filter((p) => p.count > 0),
        addOns: addOns.filter((a) => a.selected),
        totalPrice,
        summary: bookingSummary,
      },
    } as Parameters<typeof addItem>[0])

    showToast({ product, quantity: 1 })
  }, [product, isComplete, selectedDate, timeSlots, selectedSlotId, durationOptions, selectedDurationId, participants, addOns, totalPrice, addItem, showToast])

  // Handle editing sections from summary
  const handleEdit = useCallback((section: 'date' | 'time' | 'participants' | 'addons') => {
    const el = document.getElementById(`booking-section-${section}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  // Empty state
  const hasConfig = timeSlots.length > 0 || durationOptions.length > 0 || participants.length > 0
  if (!hasConfig) {
    return (
      <div className={`p-6 text-center text-grey-mid ${className}`}>
        <p className="text-sm">Geen booking configuratie beschikbaar voor dit product.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Availability status */}
      <BookingAvailabilityStatus
        status={availabilityStatus}
        spotsLeft={config.totalCapacity || undefined}
        variant="banner"
      />

      {/* Duration selection (if multiple options) */}
      {durationOptions.length > 1 && (
        <div id="booking-section-duration">
          <DurationSelector
            options={durationOptions}
            selectedOptionId={selectedDurationId}
            onOptionSelect={setSelectedDurationId}
            layout="grid"
          />
        </div>
      )}

      {/* Calendar */}
      {calendarAvailability.length > 0 && (
        <div id="booking-section-date">
          <BookingCalendar
            availableDates={calendarAvailability}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            showPrices={config.showPricesOnCalendar}
            minDate={new Date()}
          />
        </div>
      )}

      {/* Time slots */}
      {timeSlots.length > 0 && (
        <div id="booking-section-time">
          <TimeSlotSelector
            slots={timeSlots}
            selectedSlotId={selectedSlotId}
            onSlotSelect={setSelectedSlotId}
            showPrices={timeSlots.some((s) => s.price != null)}
            showDuration={durationOptions.length > 0}
            layout="grid"
          />
        </div>
      )}

      {/* Participants */}
      {participants.length > 0 && (
        <div id="booking-section-participants">
          <ParticipantSelector
            categories={participants}
            onChange={handleParticipantChange}
            totalCapacity={config.totalCapacity}
            showPrices
          />
        </div>
      )}

      {/* Add-ons */}
      {addOns.length > 0 && (
        <div id="booking-section-addons">
          <AddOnSelector
            addOns={addOns}
            onChange={handleAddOnChange}
            layout="list"
          />
        </div>
      )}

      {/* Booking summary */}
      <BookingSummaryCard
        summary={summary}
        onBook={handleBook}
        onEdit={handleEdit}
        isBooking={!isComplete}
        showEditButtons
      />
    </div>
  )
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBooking } from "../hooks/useExperiences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Experience } from "@/types/api";

const bookingSchema = z.object({
  bookingDate: z.string().min(1, "Please select a date"),
  participants: z.number().min(1, "At least 1 participant").max(20, "Maximum 20 participants"),
  notes: z.string().max(500, "Notes too long").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({ experience }: { experience: Experience }) {
  const { mutateAsync: createBooking, isPending } = useBooking(experience.id);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: 1,
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setError(null);
    try {
      await createBooking(data as any);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to book experience");
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 p-6 rounded-2xl border border-green-200 dark:border-green-900 text-center">
        <h3 className="font-bold font-outfit text-xl mb-2">Booking Confirmed!</h3>
        <p>Your local experience has been successfully booked. We've sent the details to your email.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold font-outfit text-xl mb-6">Book this Experience</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input 
            type="date" 
            {...register("bookingDate")}
            className={errors.bookingDate ? "border-red-500" : ""}
          />
          {errors.bookingDate && <p className="text-xs text-red-500">{errors.bookingDate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Participants</label>
          <Input 
            type="number" 
            min="1"
            max={experience.maxParticipants || 20}
            {...register("participants", { valueAsNumber: true })}
            className={errors.participants ? "border-red-500" : ""}
          />
          {errors.participants && <p className="text-xs text-red-500">{errors.participants.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes for the guide (Optional)</label>
          <Input 
            type="text" 
            placeholder="Special requirements or questions..."
            {...register("notes")}
            className={errors.notes ? "border-red-500" : ""}
          />
          {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
        </div>

        <div className="pt-4 border-t mt-4 flex items-center justify-between font-medium">
          <span>Total</span>
          <span>
            {experience.priceCents !== null 
              ? `${(experience.priceCents / 100).toFixed(2)} ${experience.currency} per person` 
              : "Price varies"}
          </span>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? "Booking..." : "Confirm Booking"}
        </Button>
      </form>
    </div>
  );
}

import { supabase } from '../../db/supabaseClient.js';
import { experiencesRepository } from './experiences.repository.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { BookingRequest } from './experiences.schema.js';

export const bookingService = {
  /**
   * Creates a booking for an experience.
   * Validates that the experience exists and has availability.
   */
  async createBooking(userId: string, experienceId: string, bookingData: BookingRequest) {
    // Verify experience exists and check capacity
    const experience = await experiencesRepository.findById(experienceId);

    if (experience.max_participants && bookingData.participants > experience.max_participants) {
      throw new AppError(
        `Maximum participants for this experience is ${experience.max_participants}`,
        400,
        'BOOKING_OVER_CAPACITY',
      );
    }

    // Calculate total price
    const totalPriceCents = experience.price_cents
      ? experience.price_cents * bookingData.participants
      : null;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        experience_id: experienceId,
        booking_date: bookingData.bookingDate,
        participants: bookingData.participants,
        total_price_cents: totalPriceCents,
        notes: bookingData.notes ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, userId, experienceId }, '[booking] Failed to create booking');
      throw new AppError('Failed to create booking', 500, 'BOOKING_CREATE_ERROR');
    }

    logger.info({ bookingId: data.id, userId }, '[booking] Booking created');
    return data;
  },
};

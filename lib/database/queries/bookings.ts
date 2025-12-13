// // lib/database/queries/bookings.ts
// import { db } from '@/lib/database';
// import { bookings, rooms, roomCategories, users, payments } from '@/lib/database/schema';
// import { eq, and, desc, gt, lt, or, sql } from 'drizzle-orm';

// export interface BookingWithRelations {
//   id: number;
//   customer_id: number | null;
//   room_id: number | null;
//   check_in_date: Date;
//   check_out_date: Date;
//   total_amount: number;
//   status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
//   payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
//   special_requests: string | null;
//   created_at: Date | null;
//   updated_at: Date | null;
//   room?: {
//     id: number;
//     room_number: string;
//     category?: {
//       id: number;
//       name: string;
//       base_price: number;
//     } | null;
//   } | null;
//   customer?: {
//     id: number;
//     first_name: string | null;
//     last_name: string | null;
//     email: string;
//     phone: string;
//   } | null;
//   payment?: {
//     id: number;
//     mpesa_receipt_number: string | null;
//     transaction_date: Date | null;
//     status: 'initiated' | 'completed' | 'failed' | 'cancelled';
//   } | null;
// }

// export interface BookingCreateData {
//   room_id: number;
//   customer_id?: number | null;
//   check_in_date: Date;
//   check_out_date: Date;
//   total_amount: number;
//   special_requests?: string;
// }

// export interface BookingUpdateData {
//   status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
//   payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
//   special_requests?: string;
// }

// /**
//  * Get all bookings for a specific customer with relations
//  */
// export async function getCustomerBookings(customerId: number): Promise<BookingWithRelations[]> {
//   const result = await db.select({
//     id: bookings.id,
//     customer_id: bookings.customer_id,
//     room_id: bookings.room_id,
//     check_in_date: bookings.check_in_date,
//     check_out_date: bookings.check_out_date,
//     total_amount: bookings.total_amount,
//     status: bookings.status,
//     payment_status: bookings.payment_status,
//     special_requests: bookings.special_requests,
//     created_at: bookings.created_at,
//     updated_at: bookings.updated_at,
//     room: {
//       id: rooms.id,
//       room_number: rooms.room_number,
//       category: {
//         id: roomCategories.id,
//         name: roomCategories.name,
//         base_price: roomCategories.base_price,
//       },
//     },
//     customer: {
//       id: users.id,
//       first_name: users.first_name,
//       last_name: users.last_name,
//       email: users.email,
//       phone: users.phone,
//     },
//     payment: {
//       id: payments.id,
//       mpesa_receipt_number: payments.mpesa_receipt_number,
//       transaction_date: payments.transaction_date,
//       status: payments.status,
//     },
//   })
//   .from(bookings)
//   .leftJoin(rooms, eq(bookings.room_id, rooms.id))
//   .leftJoin(roomCategories, eq(rooms.category_id, roomCategories.id))
//   .leftJoin(users, eq(bookings.customer_id, users.id))
//   .leftJoin(payments, eq(bookings.id, payments.booking_id))
//   .where(eq(bookings.customer_id, customerId))
//   .orderBy(desc(bookings.created_at));

//   return result.map(booking => ({
//     ...booking,
//     check_in_date: new Date(booking.check_in_date),
//     check_out_date: new Date(booking.check_out_date),
//     created_at: booking.created_at ? new Date(booking.created_at) : null,
//     updated_at: booking.updated_at ? new Date(booking.updated_at) : null,
//     payment: booking.payment ? {
//       ...booking.payment,
//       transaction_date: booking.payment.transaction_date ? new Date(booking.payment.transaction_date) : null,
//     } : null,
//   }));
// }

// /**
//  * Get booking by ID with relations
//  */
// export async function getBookingById(bookingId: number): Promise<BookingWithRelations | null> {
//   const [result] = await db.select({
//     id: bookings.id,
//     customer_id: bookings.customer_id,
//     room_id: bookings.room_id,
//     check_in_date: bookings.check_in_date,
//     check_out_date: bookings.check_out_date,
//     total_amount: bookings.total_amount,
//     status: bookings.status,
//     payment_status: bookings.payment_status,
//     special_requests: bookings.special_requests,
//     created_at: bookings.created_at,
//     updated_at: bookings.updated_at,
//     room: {
//       id: rooms.id,
//       room_number: rooms.room_number,
//       category: {
//         id: roomCategories.id,
//         name: roomCategories.name,
//         base_price: roomCategories.base_price,
//       },
//     },
//     customer: {
//       id: users.id,
//       first_name: users.first_name,
//       last_name: users.last_name,
//       email: users.email,
//       phone: users.phone,
//     },
//     payment: {
//       id: payments.id,
//       mpesa_receipt_number: payments.mpesa_receipt_number,
//       transaction_date: payments.transaction_date,
//       status: payments.status,
//     },
//   })
//   .from(bookings)
//   .leftJoin(rooms, eq(bookings.room_id, rooms.id))
//   .leftJoin(roomCategories, eq(rooms.category_id, roomCategories.id))
//   .leftJoin(users, eq(bookings.customer_id, users.id))
//   .leftJoin(payments, eq(bookings.id, payments.booking_id))
//   .where(eq(bookings.id, bookingId));

//   if (!result) return null;

//   return {
//     ...result,
//     check_in_date: new Date(result.check_in_date),
//     check_out_date: new Date(result.check_out_date),
//     created_at: result.created_at ? new Date(result.created_at) : null,
//     updated_at: result.updated_at ? new Date(result.updated_at) : null,
//     payment: result.payment ? {
//       ...result.payment,
//       transaction_date: result.payment.transaction_date ? new Date(result.payment.transaction_date) : null,
//     } : null,
//   };
// }

// /**
//  * Create a new booking
//  */
// export async function createBooking(bookingData: BookingCreateData) {
//   const [booking] = await db.insert(bookings).values({
//     customer_id: bookingData.customer_id || null,
//     room_id: bookingData.room_id,
//     check_in_date: Math.floor(bookingData.check_in_date.getTime() / 1000),
//     check_out_date: Math.floor(bookingData.check_out_date.getTime() / 1000),
//     total_amount: bookingData.total_amount,
//     status: 'pending',
//     payment_status: 'pending',
//     special_requests: bookingData.special_requests || null,
//   }).returning();

//   return booking;
// }

// /**
//  * Update booking status
//  */
// export async function updateBooking(bookingId: number, updateData: BookingUpdateData) {
//   const [booking] = await db.update(bookings)
//     .set({
//       ...updateData,
//       updated_at: Math.floor(Date.now() / 1000),
//     })
//     .where(eq(bookings.id, bookingId))
//     .returning();

//   return booking || null;
// }

// /**
//  * Cancel a booking (soft cancel via status change)
//  */
// export async function cancelBooking(bookingId: number) {
//   const [booking] = await db.update(bookings)
//     .set({
//       status: 'cancelled',
//       updated_at: Math.floor(Date.now() / 1000),
//     })
//     .where(eq(bookings.id, bookingId))
//     .returning();

//   return booking || null;
// }

// /**
//  * Check if a room is available for given dates
//  */
// export async function isRoomAvailable(roomId: number, checkIn: Date, checkOut: Date, excludeBookingId?: number) {
//   const checkInTimestamp = Math.floor(checkIn.getTime() / 1000);
//   const checkOutTimestamp = Math.floor(checkOut.getTime() / 1000);

//   // Find conflicting bookings (overlapping dates and not cancelled)
//   const conflictingBookings = await db.select()
//     .from(bookings)
//     .where(
//       and(
//         eq(bookings.room_id, roomId),
//         eq(bookings.status, 'confirmed'), // Only consider confirmed bookings
//         or(
//           // Check-in date falls within existing booking
//           and(
//             lt(bookings.check_in_date, checkInTimestamp),
//             gt(bookings.check_out_date, checkInTimestamp)
//           ),
//           // Check-out date falls within existing booking
//           and(
//             lt(bookings.check_in_date, checkOutTimestamp),
//             gt(bookings.check_out_date, checkOutTimestamp)
//           ),
//           // Booking completely contains the requested dates
//           and(
//             gt(bookings.check_in_date, checkInTimestamp),
//             lt(bookings.check_out_date, checkOutTimestamp)
//           )
//         ),
//         excludeBookingId ? sql`${bookings.id} != ${excludeBookingId}` : sql`1=1`
//       )
//     )
//     .limit(1);

//   return conflictingBookings.length === 0;
// }

// /**
//  * Get customer's upcoming bookings
//  */
// export async function getUpcomingBookings(customerId: number) {
//   const now = Math.floor(Date.now() / 1000);
  
//   const bookings = await getCustomerBookings(customerId);
//   return bookings.filter(booking => 
//     booking.status === 'confirmed' && 
//     booking.check_in_date.getTime() > now
//   );
// }

// /**
//  * Get customer's past bookings
//  */
// export async function getPastBookings(customerId: number) {
//   const now = Math.floor(Date.now() / 1000);
  
//   const bookings = await getCustomerBookings(customerId);
//   return bookings.filter(booking => 
//     (booking.status === 'checked_out' || booking.status === 'cancelled') ||
//     booking.check_out_date.getTime() < now
//   );
// }
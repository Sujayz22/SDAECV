import { sanityFetch } from './live';
import { ServiceTimeSlot, DEFAULT_SERVICE_TIMES } from '../timings';

export async function getServiceTimes(): Promise<ServiceTimeSlot[]> {
  try {
    const result = await sanityFetch({
      query: `*[_type == "homePageSettings"][0].serviceTimes[]{
        label,
        time,
        detail
      }`
    });
    const slots = (result?.data as ServiceTimeSlot[]) || [];
    if (slots && slots.length > 0) {
      return slots;
    }
  } catch (err) {
    console.error('Failed to fetch serviceTimes from Sanity:', err);
  }
  return DEFAULT_SERVICE_TIMES;
}

export * from '../timings';

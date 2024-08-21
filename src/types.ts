export type Image = {
  src: string;
  alt: string;
  srcset?: { src: string; width: number }[];
};

export type BookingWindow = Window &
  typeof globalThis & {
    __BRUSCKVALLEN__WEEKS_BOOKED__: { week: number; year: number }[];
  };

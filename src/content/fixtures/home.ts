import type { PromoSlide, SuccessStory } from "../types";

// PLACEHOLDERS ONLY. No packages, prices, offers, patient stories or videos
// exist yet. Slots are rendered as clearly labelled blank cards.
export const promoSlides: PromoSlide[] = [1, 2, 3, 4].map((n) => ({
  id: `promo-slot-${n}`,
  placeholder: true,
  image: null,
  packageSlug: null,
}));

export const successStories: SuccessStory[] = [1, 2, 3, 4].map((n) => ({
  id: `story-slot-${n}`,
  placeholder: true,
  video: null,
  title: {},
}));

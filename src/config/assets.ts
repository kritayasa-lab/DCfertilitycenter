/**
 * Approved clinic assets (supplied by the clinic owner; publication approved).
 *
 * These files are byte-identical copies of the originals uploaded to
 * `public/images/` and must never be edited, recoloured, retouched or
 * regenerated. Layout changes are made with CSS only. Integrity is enforced by
 * `tests/unit/assets.test.ts` (SHA-256).
 */
export interface ApprovedAsset {
  src: string;
  /** The untouched upload this file was copied from. */
  original: string;
  width: number;
  height: number;
  sha256: string;
}

export const clinicAssets = {
  /** Original clinic logo (keeps its own colours; not themed). */
  logo: {
    src: "/images/brand/dc-fertility-center-logo.png",
    original: "/images/Untitled Design - 1.PNG",
    width: 1593,
    height: 1609,
    sha256: "3f18e9ee9a154cbc24a8774dc677e983b7d5ff0156bb0f4b73f3ebf2618bc079",
  },
  /**
   * Hero centrepiece: 3D scientific artwork of ICSI (oocyte, holding pipette,
   * injection pipette with sperm). Transparent PNG supplied by the clinic owner.
   */
  icsiHero: {
    src: "/images/hero/icsi-hero.png",
    original: "/images/การปฏิสนธิไข่ด้วยเทคนิค ICSI.png",
    width: 1774,
    height: 887,
    sha256: "e1d0ac9a5edbd6b0582ed89b562b21690cde6101dd477979bc97982d0bcd14c9",
  },
  /** Photograph of both doctors. Contains the clinic's own baked-in caption. */
  heroDoctors: {
    src: "/images/doctors/hero-doctors.jpg",
    original: "/images/IMG_7370.JPG",
    width: 1440,
    height: 1440,
    sha256: "1c014f45d567d0e348e2513781bc844f28f5261c5affe0d2234db21e6be5f2dd",
  },
  /** Clinic corridor photograph used in the "Why choose" section. */
  whyChoose: {
    src: "/images/clinic/why-choose-doctors.jpg",
    original: "/images/IMG_7371.JPG",
    width: 1567,
    height: 1045,
    sha256: "801681791c9c2f5d6b43551e040653a37e44a18665a20316eb2865545fa3d078",
  },
} as const satisfies Record<string, ApprovedAsset>;

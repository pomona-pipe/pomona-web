// FIXME: Vuetify preset import
// import { preset } from 'vuetify/lib/presets/default';
const preset = {
  breakpoint: {
    scrollbarWidth: 16,
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1280,
      lg: 1920,
    },
  }
}

/**
 * TODO: update with programmatic reference if ever possible
 * Vuetify SASS vars: based on Vuetify presets/User overwrites
 * Vuetify presets: https://vuetifyjs.com/en/api/vuetify/#sass-variables
 * User overwrites: ~/assets/style/vuetify.scss
 */
const vuetifySassVars = {
  containerPaddingX: 16,
  containerMaxWidths: {
    xs: 1,
    sm: 1,
    md: .9375,
    lg: .9375,
    xl: .9375,
  },
  gridColumns: 12,
  maxCols: 12,
}

// Type for Breakpoint Columns
const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type ICols = Partial<Record<typeof breakpoints[number], number>>;
type ReqICols = Required<ICols>;

const maxThresholds: ReqICols = (() => {
  const scrollbarWidth: number = preset.breakpoint.scrollbarWidth;
  const { xs, sm, md, lg } = preset.breakpoint.thresholds;
  return {
    xs: xs - 1, // max-width
    sm: sm - 1, // max-width
    md: md - 1 - scrollbarWidth, // max-width
    lg: lg - 1 - scrollbarWidth, // max-width
    xl: lg - scrollbarWidth, // min-width
  }
})();

export function createImgSrcset(url: string, cols?: ICols, useWebp = true): string {
  if(!cols) {
    const { xs, sm, md, lg, xl } = maxThresholds;
    if(useWebp) {
      return `${url}@${xs}w.webp ${xs}w, ${url}@${sm}w.webp ${sm}w, ${url}@${md}w.webp ${md}w, ${url}@${lg}w.webp ${lg}w, ${url}@${xl}w.webp ${xl}w`;
    }
    return `${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w`;
  }
  let srcset = '';
  let colSpan: string | number = 1; // default number of cols
  for(const bp of breakpoints) {
    colSpan = cols[bp] || colSpan; // use specified number of cols, or previous, or default
    const width = calcImgWidthInCols(bp as keyof ICols, colSpan);
    const newSrc = useWebp ? `${url}@${width}w.webp` : `${url}@${width}w`;
    srcset += bp === 'xl' ? `${newSrc} ${width}w` : `${newSrc} ${width}w, `;
  }
  return srcset;
}

export function createImgSizes(cols?: ICols): string {
  if(!cols) {
    const { xs, sm, md, lg, xl } = maxThresholds;
    return `(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (min-width: ${xl}px) ${xl}px`;
  }
  let sizes = '';
  let colSpan: string | number = 1; // default number of cols
  for(const bp of breakpoints) {
    colSpan = cols[bp] || colSpan; // use specified number of cols, or previous, or default
    const width = calcImgWidthInCols(bp as keyof ICols, colSpan);
    const threshold = maxThresholds[bp]!;
    sizes += bp === 'xl' ? `(min-width: ${threshold}px) ${width}px` : `(max-width: ${threshold}px) ${width}px, `;
  }
  return sizes;
}

function calcImgWidthInCols(bp: keyof ICols, colSpan: ReqICols[keyof ReqICols]): number {
  const minThreshold = (() => {
    if(bp === 'xs') return 0;
    const bpIndex = breakpoints.indexOf(bp);
    const prevBp = breakpoints[bpIndex - 1];
    return maxThresholds[prevBp] + 1;
  })();
  const maxThreshold = maxThresholds[bp];
  const { containerMaxWidths, containerPaddingX, maxCols } = vuetifySassVars;
  const containerWidth = (containerMaxWidths[bp] < 1 ? minThreshold : maxThreshold) * containerMaxWidths[bp] - 2 * containerPaddingX;
  const numCols = maxCols / colSpan;
  const innerGutter = (() => {
    return 2 * vuetifySassVars.gridColumns * (numCols - 1); // exclude padding at row edge
  })();
  const imgWidth = (containerWidth - innerGutter) / numCols;
  return Math.ceil(imgWidth);
}

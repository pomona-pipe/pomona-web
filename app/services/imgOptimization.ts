// FIXME: Vuetify preset import
// import { preset } from 'vuetify/lib/presets/default';
const preset = {
  breakpoint: {
    scrollBarWidth: 16,
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
  rowMarginX: -12,
  colPaddingX: 12,
  maxCols: 12,
}

// Type for Breakpoint Columns
const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type ICols = Partial<Record<typeof breakpoints[number], number>>;
type ReqICols = Required<ICols>;

const bpThresholds: ReqICols = (() => {
  const scrollbarWidth: number = preset.breakpoint.scrollBarWidth;
  const { xs, sm, md, lg } = preset.breakpoint.thresholds;
  return {
    xs: xs - 1, // max-width
    sm: sm - 1, // max-width
    md: md - 1 - scrollbarWidth, // max-width
    lg: lg - 1 - scrollbarWidth, // max-width
    xl: lg - scrollbarWidth, // min-width
  }
})();
interface ILayoutConfig {
  useContainer?: boolean;
  rowMarginX?: number;
  colPaddingX?: number;
}

const defaultLayoutConfig: ILayoutConfig = {
  useContainer: true,
  rowMarginX: vuetifySassVars.rowMarginX,
  colPaddingX: vuetifySassVars.colPaddingX,
}

export function createImgSrcset(url: string, cols?: ICols, layoutConfig = defaultLayoutConfig, useWebp = true): string {
  if(!cols) {
    const { xs, sm, md, lg, xl } = bpThresholds;
    if(useWebp) {
      return `${url}@${xs}w.webp ${xs}w, ${url}@${sm}w.webp ${sm}w, ${url}@${md}w.webp ${md}w, ${url}@${lg}w.webp ${lg}w, ${url}@${xl}w.webp ${xl}w`;
    }
    return `${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w`;
  }
  let srcset = '';
  let colSpan = vuetifySassVars.maxCols; // default colSpan
  for(const bp of Object.keys(bpThresholds)) {
    colSpan = cols[bp as keyof ICols] || colSpan; // use specified number of cols, or previous, or default
    const width = calcImgWidthInCols(bp as keyof ICols, layoutConfig, colSpan);
    const newSrc = useWebp ? `${url}@${width}w.webp` : `${url}@${width}w`;
    srcset += bp === 'xl' ? `${newSrc} ${width}w` : `${newSrc} ${width}w, `;
  }
  return srcset;
}

export function createImgSizes(cols?: ICols, layoutConfig = defaultLayoutConfig): string {
  if(!cols) {
    const { xs, sm, md, lg, xl } = bpThresholds;
    return `(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (min-width: ${xl}px) ${xl}px`;
  }
  let sizes = '';
  let colSpan = vuetifySassVars.maxCols; // default colSpan
  for(const bp of Object.keys(bpThresholds)) {
    colSpan = cols[bp as keyof ICols] || colSpan; // use specified number of cols, or previous, or default
    const width = calcImgWidthInCols(bp as keyof ICols, layoutConfig, colSpan);
    const threshold = bpThresholds[bp as keyof typeof bpThresholds]!;
    sizes += bp === 'xl' ? `(min-width: ${threshold}px) ${width}px` : `(max-width: ${threshold}px) ${width}px, `;
  }
  return sizes;
}

function calcImgWidthInCols(bp: keyof ICols, layoutConfig: ILayoutConfig, colSpan: ReqICols[keyof ReqICols]): number {
  const minThreshold = (() => {
    if(bp === 'xs') return 0;
    if(bp === 'xl') return bpThresholds[bp]
    const prevBp = (() => {
      const bpIndex = Object.keys(bpThresholds).indexOf(bp);
      return Object.keys(bpThresholds)[bpIndex - 1];
    })();
    return bpThresholds[prevBp as keyof typeof bpThresholds] + 1;
  })();
  const maxThreshold = bpThresholds[bp]; // TODO: consider using higher maxThreshold for xl
  const { containerMaxWidths, containerPaddingX, maxCols } = vuetifySassVars;
  const { useContainer, rowMarginX, colPaddingX } = layoutConfig;
  const containerWidth = (containerMaxWidths[bp] < 1 ? minThreshold : maxThreshold) * containerMaxWidths[bp] - 2 * containerPaddingX;
  const contentWidth = useContainer ? containerWidth : maxThreshold;
  const numCols = Math.round(maxCols / colSpan); // NOTE: assummes efficient use of grid (i.e. No small standalone column)
  const innerGutter = 2 * (colPaddingX ?? vuetifySassVars.colPaddingX) * numCols + 2 * (rowMarginX ?? vuetifySassVars.rowMarginX);
  const imgWidth = (contentWidth - innerGutter) * colSpan / maxCols;
  debugger;
  return Math.ceil(imgWidth);
}

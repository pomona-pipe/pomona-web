import Vuetify from 'vuetify/lib';

// TODO: update with import from ~/assets/style/vuetify.scss
const vuetifyScss = {
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
  gridColumns: 12,
};
const vuetify = new Vuetify();
const { preset } = vuetify;

// Type for Breakpoint Columns
// TODO: update with import from ~/assets/style/vuetify.scss
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
const uhd = 3840;
interface ILayoutConfig {
  useContainer: boolean;
  rowMarginX: number;
  colPaddingX: number;
}

const defaultLayoutConfig: ILayoutConfig = {
  useContainer: true,
  rowMarginX: vuetifyScss.rowMarginX,
  colPaddingX: vuetifyScss.colPaddingX,
}

const imgWidthCalculator = {
  calcImgWidthInCols(bp: keyof ICols, layoutConfig: ILayoutConfig, colSpan: ReqICols[keyof ReqICols]) {
    const { gridColumns } = vuetifyScss;
    const { useContainer, rowMarginX, colPaddingX } = layoutConfig;
    const minThreshold = imgWidthCalculator.getMinThreshold(bp);
    const maxThreshold = imgWidthCalculator.getMaxThreshold(bp);
    const containerWidth = imgWidthCalculator.getContainerWidth(bp, minThreshold, maxThreshold);
    const contentWidth = imgWidthCalculator.getContentWidth(useContainer, containerWidth, maxThreshold);
    const numCols = Math.round(gridColumns / colSpan); // NOTE: assummes efficient use of grid (i.e. No small standalone column)
    const innerGutter = 2 * (colPaddingX ?? vuetifyScss.colPaddingX) * numCols + 2 * (rowMarginX ?? vuetifyScss.rowMarginX);
    const imgWidth = (contentWidth - innerGutter) * colSpan / gridColumns;
    return Math.ceil(imgWidth);
  },
  getMinThreshold(bp: keyof ICols) {
    if(bp === 'xs') return 0;
    if(bp === 'xl') return bpThresholds[bp];
    const prevBp = imgWidthCalculator.getPreviousBp(bp);
    return bpThresholds[prevBp] + 1;
  },
  getPreviousBp(bp: keyof ICols) {
    const bpIndex = Object.keys(bpThresholds).indexOf(bp);
    return Object.keys(bpThresholds)[bpIndex - 1] as keyof ICols;
  },
  getMaxThreshold(bp: keyof ICols) {
    return bp === 'xl' ? uhd : bpThresholds[bp];
  },
  getContainerWidth(bp: keyof ICols, minThreshold: number, maxThreshold: number) {
    const { containerMaxWidths, containerPaddingX } = vuetifyScss;
    return (containerMaxWidths[bp] < 1 ? minThreshold : maxThreshold) * containerMaxWidths[bp] - 2 * containerPaddingX;
  },
  getContentWidth(useContainer: boolean, containerWidth: number, maxThreshold: number) {
    return useContainer ? containerWidth : maxThreshold;
  }
}

export function createImgSrcset(url: string, cols?: ICols, layoutConfig = defaultLayoutConfig, useWebp = true): string {
  if(!cols) {
    const { xs, sm, md, lg, xl } = bpThresholds;
    if(useWebp) {
      return `${url}@${xs}w.webp ${xs}w, ${url}@${sm}w.webp ${sm}w, ${url}@${md}w.webp ${md}w, ${url}@${lg}w.webp ${lg}w, ${url}@${uhd}w.webp ${xl}w`;
    }
    return `${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${uhd}w ${xl}w`;
  }
  let srcset = '';
  let colSpan = vuetifyScss.gridColumns; // default colSpan
  for(const bp of Object.keys(bpThresholds)) {
    colSpan = cols[bp as keyof ICols] || colSpan; // use specified number of cols, or previous, or default
    const { imgWidthCalculator: { calcImgWidthInCols } } = defaultExport;
    const width = calcImgWidthInCols(bp as keyof ICols, layoutConfig, colSpan);
    const newSrc = useWebp ? `${url}@${width}w.webp` : `${url}@${width}w`;
    srcset += bp === 'xl' ? `${newSrc} ${width}w` : `${newSrc} ${width}w, `;
  }
  return srcset;
}

export function createImgSizes(cols?: ICols, layoutConfig = defaultLayoutConfig): string {
  if(!cols) {
    const { xs, sm, md, lg, xl } = bpThresholds;
    return `(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (min-width: ${xl}px) ${uhd}px`;
  }
  let sizes = '';
  let colSpan = vuetifyScss.gridColumns; // default colSpan
  for(const bp of Object.keys(bpThresholds)) {
    colSpan = cols[bp as keyof ICols] || colSpan; // use specified number of cols, or previous, or default
    const { imgWidthCalculator: { calcImgWidthInCols } } = defaultExport;
    const width = calcImgWidthInCols(bp as keyof ICols, layoutConfig, colSpan);
    const threshold = bpThresholds[bp as keyof typeof bpThresholds]!;
    sizes += bp === 'xl' ? `(min-width: ${threshold}px) ${width}px` : `(max-width: ${threshold}px) ${width}px, `;
  }
  return sizes;
}

export type { ICols };

const defaultExport = {
  createImgSrcset,
  createImgSizes,
  imgWidthCalculator,
  bpThresholds,
  uhd,
  vuetifyScss,
};
export default defaultExport;

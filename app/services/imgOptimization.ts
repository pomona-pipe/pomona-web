import { styles, BreakpointKey } from '~/utils/styles';

type ICols = Record<BreakpointKey, number>;

interface ILayoutConfig {
  useContainer: boolean;
  rowMarginX: number;
  colPaddingX: number;
}

const {
  containerPaddingX,
  containerMaxWidths,
  rowMarginX,
  colPaddingX,
  gridColumns,
  gridBreakpoints,
} = styles;
debugger;
const defaultLayoutConfig: ILayoutConfig = {
  useContainer: true,
  rowMarginX,
  colPaddingX,
}

const imgWidthCalculator = {
  calcImgWidthInCols(bp: BreakpointKey, layoutConfig: ILayoutConfig, colSpan: number) {
    const { useContainer, rowMarginX, colPaddingX } = layoutConfig;
    const maxThreshold = imgWidthCalculator.getMaxThreshold(bp);
    const containerWidth = imgWidthCalculator.getContainerWidth(bp, maxThreshold);
    const contentWidth = imgWidthCalculator.getContentWidth(useContainer, containerWidth, maxThreshold);
    const numCols = Math.round(gridColumns / colSpan); // NOTE: assummes efficient use of grid (i.e. No small standalone column)
    const innerGutter = 2 * (layoutConfig.colPaddingX ?? colPaddingX) * numCols + 2 * (layoutConfig.rowMarginX ?? rowMarginX);
    const imgWidth = (contentWidth - innerGutter) * colSpan / gridColumns;
    return Math.ceil(imgWidth);
  },
  getNextBp(bp: BreakpointKey) {
    const bpIndex = Object.keys(gridBreakpoints).indexOf(bp);
    return Object.keys(gridBreakpoints)[bpIndex + 1] as BreakpointKey;
  },
  getMaxThreshold(bp: BreakpointKey) {
    const nextBp = gridBreakpoints[imgWidthCalculator.getNextBp(bp)]
    return bp === 'xl' ? gridBreakpoints.xxl : nextBp - 1;
  },
  getContainerWidth(bp: BreakpointKey, maxThreshold: number) {
    return (containerMaxWidths[bp] ?? maxThreshold) * containerMaxWidths[bp] - 2 * containerPaddingX;
  },
  getContentWidth(useContainer: boolean, containerWidth: number, maxThreshold: number) {
    return useContainer ? containerWidth : maxThreshold;
  }
}

export function createImgSrcset(url: string, cols?: Partial<ICols>, layoutConfig = defaultLayoutConfig, useWebp = true): string {
  if(!cols) {
    const { xs, sm, md, lg, xl, xxl } = gridBreakpoints;
    if(useWebp) {
      return `${url}@${xs}w.webp ${xs}w, ${url}@${sm}w.webp ${sm}w, ${url}@${md}w.webp ${md}w, ${url}@${lg}w.webp ${lg}w, ${url}@${xxl}w.webp ${xl}w`;
    }
    return `${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xxl}w ${xl}w`;
  }
  let srcset = '';
  let colSpan = gridColumns; // default colSpan
  for(const bp of Object.keys(gridBreakpoints)) {
    colSpan = cols[bp as BreakpointKey] || colSpan; // use specified number of cols, or previous, or default
    const { imgWidthCalculator: { calcImgWidthInCols } } = defaultExport;
    const width = calcImgWidthInCols(bp as BreakpointKey, layoutConfig, colSpan);
    const newSrc = useWebp ? `${url}@${width}w.webp` : `${url}@${width}w`;
    srcset += bp === 'xl' ? `${newSrc} ${width}w` : `${newSrc} ${width}w, `;
  }
  return srcset;
}

export function createImgSizes(cols?: Partial<ICols>, layoutConfig = defaultLayoutConfig): string {
  if(!cols) {
    const { xs, sm, md, lg, xl, xxl } = gridBreakpoints;
    return `(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (min-width: ${xl}px) ${xxl}px`;
  }
  let sizes = '';
  let colSpan = gridColumns; // default colSpan
  for(const bp of Object.keys(gridBreakpoints)) {
    colSpan = cols[bp as BreakpointKey] || colSpan; // use specified number of cols, or previous, or default
    const { imgWidthCalculator: { calcImgWidthInCols } } = defaultExport;
    const width = calcImgWidthInCols(bp as BreakpointKey, layoutConfig, colSpan);
    const threshold = gridBreakpoints[bp as keyof typeof gridBreakpoints]!;
    sizes += bp === 'xl' ? `(min-width: ${threshold}px) ${width}px` : `(max-width: ${threshold}px) ${width}px, `;
  }
  return sizes;
}

const defaultExport = {
  createImgSrcset,
  createImgSizes,
  imgWidthCalculator,
};
export default defaultExport;

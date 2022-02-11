import styleUtils, { BreakpointKey, ContainerKey } from '~/utils/styles';

type ICols = Record<BreakpointKey, number>;

interface ILayoutConfig {
  useContainer: boolean;
  rowMarginX: number;
  colPaddingX: number;
}

const defaultLayoutConfig: ILayoutConfig = (() => {
  const { rowMarginX, colPaddingX } = styleUtils.useStyles();
  return {
    useContainer: true,
    rowMarginX,
    colPaddingX,
  };
})();

const utils = {
  calcImgWidthInCols(bp: BreakpointKey, layoutConfig: ILayoutConfig, colSpan: number) {
    const { useContainer, rowMarginX, colPaddingX } = layoutConfig;
    const { gridBreakpoints, gridColumns } = styleUtils.useStyles();
    const maxThreshold = utils.getMaxThresholds(gridBreakpoints)[bp];
    const containerWidth = utils.getContainerWidth(bp, maxThreshold);
    const contentWidth = useContainer ? containerWidth : maxThreshold;
    /**
     * xxl breakpoint without container
     * means that we need to use the native image, since we can't predict the max size needed
     * however, we have to specify a numeric width so that the srcset and sizes will match
     * therefore, we claim the width will be 3824, but will really use the native image
     */
    if (bp === 'xxl' && !useContainer) {
      return gridBreakpoints[bp];
    }
    const numCols = Math.round(gridColumns / colSpan);
    const innerGutter = 2 * colPaddingX * numCols + 2 * rowMarginX;
    const imgWidth = (contentWidth - innerGutter) * colSpan / gridColumns;
    return Math.ceil(imgWidth);
  },

  getMaxThresholds(breakpoints: Record<BreakpointKey, number>) {
    const { gridBreakpoints } = styleUtils.useStyles();
    return Object.entries(breakpoints).reduce((prevValue, [key]) => {
      if (key === 'xxl') {
        prevValue[key as BreakpointKey] = Infinity;
      }
      else {
        const nextBp = utils.getNextBp(key as BreakpointKey);
        prevValue[key as BreakpointKey] = gridBreakpoints[nextBp!] - 1;
      }
      return prevValue;
    }, {} as Record<BreakpointKey, number>);
  },

  getNextBp(bp: BreakpointKey): BreakpointKey | null {
    const { gridBreakpoints } = styleUtils.useStyles();
    const bpIndex = Object.keys(gridBreakpoints).indexOf(bp);
    return Object.keys(gridBreakpoints)[bpIndex + 1] as BreakpointKey ?? null;
  },

  getContainerWidth(bp: BreakpointKey, maxThreshold: number) {
    let outerWidth: number;
    const { containerPaddingX, containerMaxWidths } = styleUtils.useStyles();
    switch (bp) {
      case 'xs':
      case 'sm':
        outerWidth = maxThreshold!;
        break;
      case 'xxl':
        outerWidth = containerMaxWidths.xl;
        break;
      default:
        outerWidth = containerMaxWidths[bp as ContainerKey];
    }
    return outerWidth - 2 * containerPaddingX;
  },
};

export function createImgSrcset(url: string, cols?: Partial<ICols>, layoutConfig = defaultLayoutConfig, useWebp = true): string {
  const { gridBreakpoints, gridColumns } = styleUtils.useStyles();
  if (!cols) {
    const maxThresholds = utils.getMaxThresholds(gridBreakpoints);
    const { xs, sm, md, lg, xl } = maxThresholds;
    const { xxl } = gridBreakpoints;
    if (useWebp) {
      return `${url}@${xs}w.webp ${xs}w, ${url}@${sm}w.webp ${sm}w, ${url}@${md}w.webp ${md}w, ${url}@${lg}w.webp ${lg}w, ${url}@${xl}w.webp ${xl}w, ${url}.webp ${xxl}w`;
    }
    return `${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w, ${url} ${xxl}w`;
  }
  let srcset = '';
  let colSpan = gridColumns; // default colSpan
  for (const bp of Object.keys(gridBreakpoints)) {
    colSpan = cols[bp as BreakpointKey] || colSpan; // use specified number of cols, or previous, or default
    const { utils: { calcImgWidthInCols } } = defaultExport;
    const width = calcImgWidthInCols(bp as BreakpointKey, layoutConfig, colSpan);
    let newSrc: string;
    if (bp !== 'xxl') {
      newSrc = useWebp ? `${url}@${width}w.webp` : `${url}@${width}w`;
      srcset += `${newSrc} ${width}w, `;
      continue;
    }
    const useNativeImg = width === gridBreakpoints[bp];
    newSrc = useNativeImg ? url : `${url}@${width}w`;
    if (useWebp) {
      newSrc += '.webp';
    }
    srcset += `${newSrc} ${width}w`;
  }
  return srcset;
}

export function createImgSizes(cols?: Partial<ICols>, layoutConfig = defaultLayoutConfig): string {
  const { gridBreakpoints, gridColumns } = styleUtils.useStyles();
  const maxThresholds = utils.getMaxThresholds(gridBreakpoints);
  if (!cols) {
    const { xs, sm, md, lg, xl } = maxThresholds;
    const { xxl } = gridBreakpoints;
    return `(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (max-width: ${xl}px) ${xl}px, (min-width: ${xxl}px) ${xxl}px`;
  }
  let sizes = '';
  let colSpan = gridColumns; // default colSpan
  for (const bp of Object.keys(gridBreakpoints)) {
    colSpan = cols[bp as BreakpointKey] || colSpan; // use specified number of cols, or previous, or default
    const { utils: { calcImgWidthInCols } } = defaultExport;
    const width = calcImgWidthInCols(bp as BreakpointKey, layoutConfig, colSpan);
    sizes += bp === 'xxl'
      ? `(min-width: ${gridBreakpoints.xxl}px) ${width}px`
      : `(max-width: ${maxThresholds[bp as BreakpointKey]}px) ${width}px, `;
  }
  return sizes;
}

const defaultExport = {
  utils,
  createImgSrcset,
  createImgSizes,
};
export default defaultExport;

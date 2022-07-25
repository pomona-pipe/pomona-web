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
  /**
   * @param layoutConfig detailed column layout specs when cols param is provided
   * @param layoutConfig.useContainer `=true` states if the layout uses a Vuetify container
   * @param layoutConfig.rowMarginX `=-12` the row margin in a layout
   * @param layoutConfig.colPaddingX `=12` left/right column pixel padding
   * @param cols vuetify column width for each breakpoint; ex. `{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 1 }`. Note: no need to specify the same value for consecutive breakpoints, and no need to specify a starting value of 12; i.e. `{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }` could just be written as `{ sm: 6 }`
   * @param pxThreshold `=100` the pixel threshold for deciding when to add a smaller image url
   * @returns the minimum number of image URLs needed to satisfy the width requirement of each breakpoint and the pxThreshold param
   */
  getImgWidthSet(layoutConfig: ILayoutConfig, cols: Partial<ICols>, pxThreshold = 100) {
    const { gridBreakpoints, gridColumns } = styleUtils.useStyles();
    let colSpan = gridColumns; // default colSpan

    let imgWidths = {} as Record<BreakpointKey, number | 'nativeSize'>;
    for (const bp of Object.keys(gridBreakpoints)) {
      colSpan = cols[bp as BreakpointKey] || colSpan; // use specified number of cols, or previous, or default
      const width = utils.calcImgWidthInCols(bp as BreakpointKey, layoutConfig, colSpan);
      imgWidths[bp as BreakpointKey] = width;
    }

    const widthsToUse = Object.values(imgWidths)
      // sort in descending for deciding set of possible widths
      .sort((a, b) => {
        if (a === 'nativeSize') {
          return -1;
        }
        if (b === 'nativeSize') {
          return 1;
        }
        return b - a;
      })
      // choose values (starting from max) that meet or exceed px threshold
      .reduce((prevValue, value) => {
        if(value === 'nativeSize') {
          prevValue.push(value);
          return prevValue;
        }
        const isEmpty = prevValue.length === 0;
        const meetsThreshold = (() => {
          const min = Math.min(...(prevValue.filter((v) => v !== 'nativeSize') as number[]));
          return min - value >= pxThreshold;
        })();
        if(isEmpty || meetsThreshold)  {
          prevValue.push(value);
        }
        return prevValue;
      }, [] as (number | 'nativeSize')[])
      // reorder in ascending to choose lowest possible value for each breakpoint
      .sort((a, b) => {
        if (a === 'nativeSize') {
          return 1;
        }
        if (b === 'nativeSize') {
          return -1;
        }
        return a - b;
      });

    // choose minimum possible width for each breakpoint
    return Object.entries(imgWidths).map(([bp, width]) => {
      const widthToUse = width === 'nativeSize'
        ? width
        : widthsToUse.find((minWidth) => minWidth >= width)!;
      return [bp, widthToUse] as [BreakpointKey, number | 'nativeSize'];
    })
  },

  /**
   *
   * @param bp name of the vuetify breakpoint: xs | sm | md | lg | xl | xxl
   * @param layoutConfig detailed column layout specs when cols param is provided
   * @param layoutConfig.useContainer `=true` states if the layout uses a Vuetify container
   * @param layoutConfig.rowMarginX `=-12` the row margin in a layout
   * @param layoutConfig.colPaddingX `=12` left/right column pixel padding
   * @param colSpan vuetify column value (out of 12)
   * @returns the largest possible size of an image at a given breakpoint, with a given colspan
   */
  calcImgWidthInCols(bp: BreakpointKey, layoutConfig: ILayoutConfig, colSpan: number) {
    const { useContainer, rowMarginX, colPaddingX } = layoutConfig;
    const { gridColumns } = styleUtils.useStyles();
    const maxThreshold = utils.getMaxThresholds()[bp];
    const containerWidth = utils.getContainerWidth(bp);
    const contentWidth = useContainer ? containerWidth : maxThreshold;

    if (bp === 'xxl' && !useContainer) {
      return 'nativeSize';
    }

    const numCols = Math.round(gridColumns / colSpan);
    const innerGutter = 2 * colPaddingX * numCols + 2 * rowMarginX;
    const imgWidth = (contentWidth - innerGutter) * colSpan / gridColumns;
    return Math.ceil(imgWidth);
  },


  /**
   * @returns the max pixel value of each vuetify breakpoint (xxl is null)
   */
  getMaxThresholds() {
    const { gridBreakpoints } = styleUtils.useStyles();
    return Object.entries(gridBreakpoints).reduce((prevValue, [key]) => {
      const nextBp = utils.getNextBp(key as BreakpointKey);
      prevValue[key as BreakpointKey] = key === 'xxl'
        ? Infinity
        : gridBreakpoints[nextBp!] - 1;
      return prevValue;
    }, {} as Record<BreakpointKey, number>);
  },

  /**
   *
   * @param bp name of the vuetify breakpoint: xs | sm | md | lg | xl | xxl
   * @returns the next breakpoint; e.g. xs => sm
   */
  getNextBp(bp: BreakpointKey): BreakpointKey | null {
    const { gridBreakpoints } = styleUtils.useStyles();
    const bpIndex = Object.keys(gridBreakpoints).indexOf(bp);
    return Object.keys(gridBreakpoints)[bpIndex + 1] as BreakpointKey ?? null;
  },

  /**
   *
   * @param bp name of the vuetify breakpoint: xs | sm | md | lg | xl | xxl
   * @returns inner content width of the vuetify container
   */
  getContainerWidth(bp: BreakpointKey) {
    let outerWidth: number;
    const { containerPaddingX, containerMaxWidths } = styleUtils.useStyles();
    const maxThresholds = utils.getMaxThresholds();
    switch (bp) {
      case 'xs':
        outerWidth = maxThresholds.xs;
        break;
      case 'sm':
        outerWidth = maxThresholds.sm;
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

/**
 *
 * @param url image url
 * @param cols vuetify column width for each breakpoint; ex. `{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 1 }`. Note: no need to specify the same value for consecutive breakpoints, and no need to specify a starting value of 12; i.e. `{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }` could just be written as `{ sm: 6 }`
 * @param layoutConfig detailed column layout specs when cols param is provided
 * @param layoutConfig.useContainer `=true` states if the layout uses a Vuetify container
 * @param layoutConfig.rowMarginX `=-12` the row margin in a layout
 * @param layoutConfig.colPaddingX `=12` left/right column pixel padding
 * @param useWebp `=true` appends webp to end of image src
 * @returns a string of comma-separated image URLs, representing the image at different sizes
 */
export function createImgSrcset(url: string, cols?: Partial<ICols>, layoutConfig = defaultLayoutConfig, useWebp = true): string {
  const { gridBreakpoints } = styleUtils.useStyles();

  if (!cols) {
    const maxThresholds = utils.getMaxThresholds();
    const { xs, sm, md, lg, xl } = maxThresholds;
    const { xxl } = gridBreakpoints;
    if (useWebp) {
      return `${url}@${xs}w.webp ${xs}w, ${url}@${sm}w.webp ${sm}w, ${url}@${md}w.webp ${md}w, ${url}@${lg}w.webp ${lg}w, ${url}@${xl}w.webp ${xl}w, ${url}.webp ${xxl}w`;
    }
    return `${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w, ${url} ${xxl}w`;
  }

  const srcset: string[] = [];
  const colImgs = utils.getImgWidthSet(layoutConfig, cols);
  colImgs.forEach(([bp, width]) => {
    const isDupe = srcset.find((src) => src.includes(`${width}`));
    if(isDupe) {
      return;
    }

    const useNativeImg = width === 'nativeSize';
    let newSrc: string;
    newSrc = useNativeImg ? url : `${url}@${width}w`;
    if (useWebp) {
      newSrc += '.webp';
    }
    srcset.push(`${newSrc} ${width}w`);
  });

  return srcset.join(', ');
}

/**
 *
 * @param cols vuetify column width for each breakpoint; ex. `{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 1 }`. Note: no need to specify the same value for consecutive breakpoints, and no need to specify a starting value of 12; i.e. `{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }` could just be written as `{ sm: 6 }`
 * @param layoutConfig detailed column layout specs when cols param is provided
 * @param layoutConfig.useContainer `=true` states if the layout uses a Vuetify container
 * @param layoutConfig.rowMarginX `=-12` the row margin in a layout
 * @param layoutConfig.colPaddingX `=12` left/right column pixel padding
 * @returns a comma-separated list of which image size to use at each media query interval
 */
export function createImgSizes(cols?: Partial<ICols>, layoutConfig = defaultLayoutConfig): string {
  const { gridBreakpoints } = styleUtils.useStyles();
  const maxThresholds = utils.getMaxThresholds();

  if (!cols) {
    const { xs, sm, md, lg, xl } = maxThresholds;
    const { xxl } = gridBreakpoints;
    return `(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (max-width: ${xl}px) ${xl}px, (min-width: ${xxl}px) ${xxl}px`;
  }

  const sizes: string[] = [];
  const colImgs = utils.getImgWidthSet(layoutConfig, cols);

  colImgs.forEach(([bp, width], index, arr) => {
    const prevSize = sizes[sizes.length - 1];
    const isConsecutiveDupe = prevSize?.includes(`${width}`)
    const isLast = index === arr.length - 1;
    if(isConsecutiveDupe && !isLast) {
      sizes.splice(-1, 1);
    }

    const bpSize = !isLast
      ? `(max-width: ${maxThresholds[bp as BreakpointKey]}px) ${width}px`
      : `(min-width: ${gridBreakpoints[bp as BreakpointKey]}px) ${width}px`;
    sizes.push(bpSize);
  });

  return sizes.join(', ');
}

const defaultExport = {
  utils,
  createImgSrcset,
  createImgSizes,
};
export default defaultExport;

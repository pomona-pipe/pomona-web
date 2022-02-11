import imgOptimization from '~/services/imgOptimization';
import styleUtils, { BreakpointKey, ContainerKey } from '~/utils/styles';

const globalMocks = {
  styles: {
    // vuetify
    bodyFontFamily: '"Open Sans", sans-serif',
    headingFontFamily: '"Poppins", sans-serif',
    btnTextTransform: 'capitalize',
    containerPaddingX: 16,
    containerMaxWidths: {
      md: 900,
      lg: 1185,
      xl: 1785,
    },
    rowMarginX: -12,
    colPaddingX: 12,
    gridColumns: 12,
    gridBreakpoints: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1264,
      xl: 1904,
      xxl: 3824,
    },
    // app
    subheadingFontFamily: '"Playfair Display", serif',
    buttonFontFamily: '"Roboto", serif',
  },
  maxThresholds: {
    xs: 599,
    sm: 959,
    md: 1263,
    lg: 1903,
    xl: 3823,
    xxl: Infinity,
  }
};

describe('Image Optimization Service', () => {
  const { createImgSrcset, createImgSizes, utils } = imgOptimization;

  // global test params
  const cols = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    xl: 2,
    xxl: 1,
  };
  const layoutConfig = {
    useContainer: true,
    rowMarginX: globalMocks.styles.rowMarginX,
    colPaddingX: globalMocks.styles.colPaddingX,
  };
  let useWebp = false;

  // module spies/mocks
  jest.spyOn(styleUtils, 'useStyles').mockImplementation(() => globalMocks.styles);
  const colsSpy = jest.spyOn(utils, 'calcImgWidthInCols');

  beforeEach(() => {
    // default mock implementation for colsSpy
    colsSpy.mockImplementation(() => 100);
  });

  afterEach(() => {
    jest.clearAllMocks(); // resets mock usage data between tests
    useWebp = false;
  });

  describe('createImgSrcset function', () => {
    const url = 'https://example.com/images/photo.jpg';
    const splitImages = (srcSet: string) => {
      return srcSet.split(/,\s?/);
    };

    describe('Full-width image layout', () => {
      it('Should return image sources corresponding to each grid breakpoint', () => {
        const srcSet = createImgSrcset(url, undefined, layoutConfig, useWebp);
        const { xs, sm, md, lg, xl } = globalMocks.maxThresholds;
        const { xxl } = globalMocks.styles.gridBreakpoints;
        expect(srcSet).toEqual(`${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w, ${url} ${xxl}w`)
      });

      it('Should return webp images when requested', () => {
        // without webp
        let srcSet = createImgSrcset(url, undefined, layoutConfig, useWebp);
        let images = splitImages(srcSet);
        images.forEach((img) => {
          expect(img.includes('.webp')).toBe(false);
        });

        // with webp
        useWebp = true;
        srcSet = createImgSrcset(url, undefined, layoutConfig, useWebp);
        images = splitImages(srcSet);
        images.forEach((img) => {
          expect(img.includes('.webp')).toBe(true);
        });
      });
    });

    describe('Column image layout', () => {
      it('Should return image sources corresponding to each grid breakpoint', () => {
        createImgSrcset(url, cols, layoutConfig, useWebp);
        Object.entries(cols).forEach(([bp, colSpan], index) => {
          expect(colsSpy).toHaveBeenNthCalledWith(++index, bp, layoutConfig, colSpan);
        });
      });

      it('Should use the native image url for the xxl breakpoint if calcImgWidthInCols returns the xxl breakpoint width', () => {
        colsSpy.mockImplementation(() => globalMocks.styles.gridBreakpoints.xxl);
        const srcset = createImgSrcset(url, cols, layoutConfig, useWebp);
        const srcArr = splitImages(srcset);
        const lastIndex = srcArr.length - 1;
        srcArr.forEach((src, index) => {
          if(index !== lastIndex) {
            expect(src.includes('@')).toBe(true);
            return;
          }
          expect(src.includes('@')).toBe(false);
        });
      });

      it('Should return webp when requested', () => {
        // without webp
        let srcSet = createImgSrcset(url, cols, layoutConfig, useWebp);
        let images = splitImages(srcSet);
        images.forEach((img) => {
          expect(img.includes('.webp')).toBe(false);
        });

        // with webp
        useWebp = true;
        srcSet = createImgSrcset(url, cols, layoutConfig, useWebp);
        images = splitImages(srcSet);
        images.forEach((img) => {
          expect(img.includes('.webp')).toBe(true);
        });
      });
    });
  });

  describe('createImgSizes function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // resets mock usage data between tests
    });

    describe('Full-width image layout', () => {
      it('Should return image sizes corresponding to each grid breakpoint', () => {
        const sizes = createImgSizes();
        const { xs, sm, md, lg, xl } = globalMocks.maxThresholds;
        const { xxl } = globalMocks.styles.gridBreakpoints;
        expect(sizes).toEqual(`(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (max-width: ${xl}px) ${xl}px, (min-width: ${xxl}px) ${xxl}px`)
      });
    })

    describe('Column image layout', () => {
      it('Should return image sources corresponding to each grid breakpoint', () => {
        createImgSizes(cols, layoutConfig);
        Object.entries(cols).forEach(([bp, colSpan], index) => {
          expect(colsSpy).toHaveBeenNthCalledWith(++index, bp, layoutConfig, colSpan);
        });
      });
    });
  });

  describe('utils object', () => {
    const { getMaxThresholds, getNextBp, getContainerWidth } = utils;

    describe('getNextBp method', () => {
      it('returns the next breakpoint for every breakpoint below xxl', () => {
        const { gridBreakpoints } = globalMocks.styles;
        const toTest = Object.keys(gridBreakpoints).slice(-1) as Omit<BreakpointKey, 'xxl'>[];
        for(const bp in toTest) {
          const nextBp = getNextBp(bp as BreakpointKey);
          const nextIndex = Object.keys(gridBreakpoints).indexOf(nextBp!);
          expect(nextBp).toBe(Object.keys(gridBreakpoints)[nextIndex]);
        }
      });

      it('returns null for xxl breakpoint', () => {
        expect(getNextBp('xxl')).toBe(null);
      })
    })

    describe('getMaxThresholds method', () => {
      it('calculates the correct values for each breakpoint', () => {
        const { gridBreakpoints, gridBreakpoints: { sm, md, lg, xl, xxl } } = globalMocks.styles;
        const maxThresholds = getMaxThresholds(gridBreakpoints);
        const expected = {
          xs: sm - 1,
          sm: md - 1,
          md: lg - 1,
          lg: xl - 1,
          xl: xxl - 1,
          xxl: Infinity,
        };
        expect(maxThresholds).toStrictEqual(expected);
      });
    });

    describe('getContainerWidth method', () => {
      it('returns the correct value for each breakpoint', () => {
        const { maxThresholds, styles: { containerMaxWidths, containerPaddingX, gridBreakpoints } } = globalMocks;

        Object.keys(gridBreakpoints).forEach((bp) => {
          const maxThreshold = maxThresholds[bp as BreakpointKey];
          const containerWidth = getContainerWidth(bp as BreakpointKey, maxThreshold);

          let threshold: number;
          if(bp === 'xxl') {
            threshold = containerMaxWidths.xl;
          } else {
            threshold = containerMaxWidths[bp as ContainerKey] ?? maxThreshold;
          }

          const expected = threshold - 2 * containerPaddingX;
          expect(containerWidth).toBe(expected);
        });
      });
    });

    describe('calcImgWidthInCols method', () => {
      beforeAll(() => {
        colsSpy.mockRestore();
      })

      it('xxl breakpoint, no container - calculates the correct image width to be used inside columns', () => {
        const { maxThresholds, styles: { rowMarginX, colPaddingX, gridBreakpoints, containerMaxWidths, containerPaddingX }} = globalMocks;

        // test params
        const bp = 'xxl';
        const colSpan = cols[bp];
        const layoutConfig = {
          useContainer: false,
          rowMarginX,
          colPaddingX,
        };

        // local module mocks
        const maxThresholdsSpy = jest.spyOn(utils, 'getMaxThresholds').mockImplementationOnce(() => maxThresholds);
        const containerWidthSpy = jest.spyOn(utils, 'getContainerWidth').mockImplementationOnce(() => containerMaxWidths.xl - 2 * containerPaddingX);

        const imgWidth = utils.calcImgWidthInCols(bp, layoutConfig, colSpan);
        const expected = gridBreakpoints.xxl;

        expect(imgWidth).toBe(expected);
        expect(maxThresholdsSpy).toHaveBeenCalled();
        expect(containerWidthSpy).toHaveBeenCalledWith(bp, maxThresholds[bp]);
      });

      it('calculates the correct image width to be used inside columns', () => {
        // test params
        const bp = 'md';
        const colSpan = cols[bp];

        // local module mocks
        const mdMocks = {
          containerWidth: 868,
          contentWidth: 868,
        };
        const maxThresholdsSpy = jest.spyOn(utils, 'getMaxThresholds').mockImplementationOnce(() => globalMocks.maxThresholds);
        const containerWidthSpy = jest.spyOn(utils, 'getContainerWidth').mockImplementationOnce(() => mdMocks.containerWidth);

        const imgWidth = utils.calcImgWidthInCols(bp, layoutConfig, colSpan);
        const expected = (() => {
          const { rowMarginX, colPaddingX } = layoutConfig;
          const { gridColumns } = globalMocks.styles;
          const numCols = Math.round(gridColumns / colSpan);
          const innerGutter = 2 * colPaddingX * numCols + 2 * rowMarginX;
          const imgWidth = (mdMocks.contentWidth - innerGutter) * colSpan / gridColumns;
          return Math.ceil(imgWidth);
        })();

        expect(imgWidth).toBe(expected);
        expect(maxThresholdsSpy).toHaveBeenCalled();
        expect(containerWidthSpy).toHaveBeenCalledWith(bp, globalMocks.maxThresholds[bp]);
      });
    });
  });
});

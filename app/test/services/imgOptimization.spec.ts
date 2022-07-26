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

const { createImgSrcset, createImgSizes, utils } = imgOptimization;

describe('Image Optimization Service', () => {
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
  let useWebp: boolean;
  const mockWidthSet: Record<BreakpointKey, number> = {
    xs: 100,
    sm: 200,
    md: 300,
    lg: 400,
    xl: 500,
    xxl: 600,
  }

  // module spies
  let imgWidthSetSpy: jest.SpyInstance<[BreakpointKey, number | 'nativeSize'][]>;
  let colsSpy: jest.SpyInstance<number | 'nativeSize'>;

  beforeAll(() => {
    // use mock vuetify scss values
    jest.spyOn(styleUtils, 'useStyles').mockImplementation(() => globalMocks.styles);
  });

  beforeEach(() => {
    useWebp = false;

    // default mock implementations for imgWidthSetSpy and colsSpy
    imgWidthSetSpy= jest.spyOn(utils, 'getImgWidthSet').mockImplementation(() => {
      const { xs, sm, md, lg, xl, xxl } = mockWidthSet;
      return [['xs', xs], ['sm', sm], ['md', md], ['lg', lg], ['xl', xl], ['xxl', xxl]];
    });
    colsSpy = jest.spyOn(utils, 'calcImgWidthInCols').mockImplementation(() => 100);
  });

  describe('createImgSrcset function', () => {
    const url = 'https://example.com/images/photo.jpg';
    const splitImages = (srcset: string) => {
      return srcset.split(/,\s?/);
    };

    describe('Full-width image layout', () => {
      it('Should return image sources corresponding to each grid breakpoint', () => {
        const srcset = createImgSrcset(url, undefined, layoutConfig, useWebp);
        const { xs, sm, md, lg, xl } = globalMocks.maxThresholds;
        const { xxl } = globalMocks.styles.gridBreakpoints;

        expect(srcset).toEqual(`${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w, ${url} ${xxl}w`)
      });

      it('Should return webp images when requested', () => {
        // without webp
        let srcset = createImgSrcset(url, undefined, layoutConfig, useWebp);
        let images = splitImages(srcset);

        images.every((img) => expect(img.includes('.webp')).toBe(false))

        // with webp
        useWebp = true;
        srcset = createImgSrcset(url, undefined, layoutConfig, useWebp);
        images = splitImages(srcset);

        images.every((img) => expect(img.includes('.webp')).toBe(true));
      });
    });

    describe('Column image layout', () => {
      it('Should return image sources corresponding to each grid breakpoint', () => {
        const srcset = createImgSrcset(url, cols, layoutConfig, useWebp);
        const { xs, sm, md, lg, xl, xxl } = mockWidthSet;

        expect(imgWidthSetSpy).toHaveBeenCalledWith(layoutConfig, cols);
        expect(srcset).toEqual(`${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xl}w ${xl}w, ${url}@${xxl}w ${xxl}w`)
      });

      it('Should use the native image url for the xxl breakpoint if getImgWidthSet returns "nativeSize"', () => {
        imgWidthSetSpy.mockImplementation(() => [['xs', 100], ['xxl', 'nativeSize']]);
        const srcset = createImgSrcset(url, cols, layoutConfig, useWebp);
        const srcArr = splitImages(srcset);
        const lastIndex = srcArr.length - 1;

        expect(imgWidthSetSpy).toBeCalledWith(layoutConfig, cols);

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
        let srcset = createImgSrcset(url, cols, layoutConfig, useWebp);
        let images = splitImages(srcset);

        images.every((img) => expect(img.includes('.webp')).toBe(false));

        useWebp = true;
        srcset = createImgSrcset(url, cols, layoutConfig, useWebp);
        images = splitImages(srcset);

        images.every((img) => expect(img.includes('.webp')).toBe(true));
      });

      it('should only include one of each image size', () => {
        const dupeWidthSet = {
          xs: 100,
          sm: 100,
          md: 200,
          lg: 300,
          xl: 100,
          xxl: 100,
        };
        imgWidthSetSpy.mockImplementation(() => [
          ['xs', dupeWidthSet.xs],
          ['sm', dupeWidthSet.sm],
          ['md', dupeWidthSet.md],
          ['lg', dupeWidthSet.lg],
          ['xl', dupeWidthSet.xl],
          ['xxl', dupeWidthSet.xxl],
        ]);
        const srcset = createImgSrcset(url, cols, layoutConfig, useWebp);
        expect(srcset).toEqual(`${url}@${dupeWidthSet.xs}w ${dupeWidthSet.xs}w, ${url}@${dupeWidthSet.md}w ${dupeWidthSet.md}w, ${url}@${dupeWidthSet.lg}w ${dupeWidthSet.lg}w`);
      });
    });
  });

  describe('createImgSizes function', () => {
    describe('Full-width image layout', () => {
      it('Should return image sizes corresponding to each grid breakpoint', () => {
        const sizes = createImgSizes();
        const { xs, sm, md, lg, xl } = globalMocks.maxThresholds;
        const { xxl } = globalMocks.styles.gridBreakpoints;

        expect(sizes).toEqual(`(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (max-width: ${xl}px) ${xl}px, (min-width: ${xxl}px) ${xxl}px`);
      });
    })

    describe('Column image layout', () => {
      it('Should return image sources corresponding to each grid breakpoint', () => {
        const sizes = createImgSizes(cols, layoutConfig);
        const { xs, sm, md, lg, xl } = globalMocks.maxThresholds;
        const { xxl } = globalMocks.styles.gridBreakpoints;

        expect(imgWidthSetSpy).toHaveBeenCalledWith(layoutConfig, cols);
        expect(sizes).toEqual(`(max-width: ${xs}px) ${mockWidthSet.xs}px, (max-width: ${sm}px) ${mockWidthSet.sm}px, (max-width: ${md}px) ${mockWidthSet.md}px, (max-width: ${lg}px) ${mockWidthSet.lg}px, (max-width: ${xl}px) ${mockWidthSet.xl}px, (min-width: ${xxl}px) ${mockWidthSet.xxl}px`);
      });

      it('does not duplicate sizes from consecutive breakpoints', () => {
        const dupeWidthSet = {
          xs: 100,
          sm: 100,
          md: 200,
          lg: 300,
          xl: 100,
          xxl: 100,
        };
        imgWidthSetSpy.mockImplementation(() => [
          ['xs', dupeWidthSet.xs],
          ['sm', dupeWidthSet.sm],
          ['md', dupeWidthSet.md],
          ['lg', dupeWidthSet.lg],
          ['xl', dupeWidthSet.xl],
          ['xxl', dupeWidthSet.xxl],
        ]);
        const sizes = createImgSizes(cols, layoutConfig);
        const { sm, md, lg, xl } = globalMocks.maxThresholds;
        const { xxl } = globalMocks.styles.gridBreakpoints;

        expect(sizes).toEqual(`(max-width: ${sm}px) ${dupeWidthSet.sm}px, (max-width: ${md}px) ${dupeWidthSet.md}px, (max-width: ${lg}px) ${dupeWidthSet.lg}px, (max-width: ${xl}px) ${dupeWidthSet.xl}px, (min-width: ${xxl}px) ${dupeWidthSet.xxl}px`);
      })
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
        const { gridBreakpoints: { sm, md, lg, xl, xxl } } = globalMocks.styles;
        const maxThresholds = getMaxThresholds();
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
          const containerWidth = getContainerWidth(bp as BreakpointKey);

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
      beforeEach(() => {
        colsSpy.mockRestore();
      })

      it('xxl breakpoint, no container - calculates the correct image width to be used inside columns', () => {
        const { maxThresholds, styles: { rowMarginX, colPaddingX, containerMaxWidths, containerPaddingX }} = globalMocks;

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
        const expected = 'nativeSize';

        expect(imgWidth).toBe(expected);
        expect(maxThresholdsSpy).toHaveBeenCalled();
        expect(containerWidthSpy).toHaveBeenCalledWith(bp);
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
        expect(containerWidthSpy).toHaveBeenCalledWith(bp);
      });
    });

    describe('getImgWidthSet method', () => {
      beforeEach(() => {
        imgWidthSetSpy.mockRestore();
      });

      it('returns a list of responsive column images that satisfies the required widths for each breakpoint and the pxThreshold param', () => {
        const nativeImgWidth = 4000;
        const mockImgWidths: Record<BreakpointKey, number> = {
          xs: Math.ceil(globalMocks.maxThresholds.xs/(globalMocks.styles.gridColumns/cols.xs)), // 599
          sm: Math.ceil(globalMocks.maxThresholds.sm/(globalMocks.styles.gridColumns/cols.sm)), // 480
          md: Math.ceil(globalMocks.maxThresholds.md/(globalMocks.styles.gridColumns/cols.md)), // 421
          lg: Math.ceil(globalMocks.maxThresholds.lg/(globalMocks.styles.gridColumns/cols.lg)), // 476
          xl: Math.ceil(globalMocks.maxThresholds.xl/(globalMocks.styles.gridColumns/cols.xl)), // 638
          xxl: Math.ceil(nativeImgWidth/(globalMocks.styles.gridColumns/cols.xxl)), // 334
        };

        colsSpy.mockImplementationOnce(() => mockImgWidths.xs);
        colsSpy.mockImplementationOnce(() => mockImgWidths.sm);
        colsSpy.mockImplementationOnce(() => mockImgWidths.md);
        colsSpy.mockImplementationOnce(() => mockImgWidths.lg);
        colsSpy.mockImplementationOnce(() => mockImgWidths.xl);
        colsSpy.mockImplementationOnce(() => mockImgWidths.xxl);

        const pxThreshold = 100;
        const colImgs = utils.getImgWidthSet(layoutConfig, cols, pxThreshold);
        const expected = [
          ['xs', 638],
          ['sm', 480],
          ['md', 480],
          ['lg', 480],
          ['xl', 638],
          ['xxl', 334],
        ];

        expect(colImgs).toEqual(expected);
        expect(colsSpy).toHaveBeenCalledTimes(6);
      });

      it('returns the native image width when the calculated width is "nativeSize"', () => {
        const mockImgWidths: Record<BreakpointKey, number | 'nativeSize'> = {
          xs: globalMocks.maxThresholds.xs,
          sm: globalMocks.maxThresholds.sm,
          md: globalMocks.maxThresholds.md,
          lg: globalMocks.maxThresholds.lg,
          xl: globalMocks.maxThresholds.xl,
          xxl: 'nativeSize',
        };
        colsSpy.mockImplementationOnce(() => mockImgWidths.xs);
        colsSpy.mockImplementationOnce(() => mockImgWidths.sm);
        colsSpy.mockImplementationOnce(() => mockImgWidths.md);
        colsSpy.mockImplementationOnce(() => mockImgWidths.lg);
        colsSpy.mockImplementationOnce(() => mockImgWidths.xl);
        colsSpy.mockImplementationOnce(() => mockImgWidths.xxl);
        const pxThreshold = 100;
        const colImgs = utils.getImgWidthSet(layoutConfig, cols, pxThreshold);

        const expected = [
          ['xs', 599],
          ['sm', 959],
          ['md', 1263],
          ['lg', 1903],
          ['xl', 3823],
          ['xxl', 'nativeSize'],
        ];
        expect(colImgs).toEqual(expected);
        expect(colsSpy).toHaveBeenCalledTimes(6);
      });
    });
  });
});

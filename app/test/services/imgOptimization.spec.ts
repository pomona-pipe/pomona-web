import imgOptimization from '~/services/imgOptimization';
import { styles, BreakpointKey } from '~/utils/styles';

describe('Image Optimization Service', () => {
  const { createImgSrcset, createImgSizes, imgWidthCalculator } = imgOptimization;
  const { gridBreakpoints, gridBreakpoints: { xs, sm, md, lg, xl, xxl } } = styles;
  const cols = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    xl: 2,
  };
  const layoutConfig = {
    useContainer: true,
    rowMarginX: styles.rowMarginX,
    colPaddingX: styles.colPaddingX,
  };
  const colsSpy = jest.spyOn(imgWidthCalculator, 'calcImgWidthInCols').mockImplementationOnce(() => 100);

  describe('createImgSrcset function', () => {
    const url = 'https://example.com/images/photo.jpg';
    const splitImages = (srcSet: string) => {
      return srcSet.split(/,\s?/);
    };
    let useWebp = false;

    afterEach(() => {
      jest.clearAllMocks(); // resets mock usage data between tests
      useWebp = false;
    });

    it('Should return image sources corresponding to each Vuetify breakpoint', () => {
      const srcSet = createImgSrcset(url, undefined, undefined, useWebp);
      expect(srcSet).toEqual(`${url}@${xs}w ${xs}w, ${url}@${sm}w ${sm}w, ${url}@${md}w ${md}w, ${url}@${lg}w ${lg}w, ${url}@${xxl}w ${xl}w`)
    });

    it('Should return webp images when requested', () => {
      // without webp
      let srcSet = createImgSrcset(url, undefined, undefined, useWebp);
      let images = splitImages(srcSet);
      images.forEach((img) => {
        expect(img.includes('.webp')).toBe(false);
      });

      // with webp
      useWebp = true;
      srcSet = createImgSrcset(url, undefined, undefined, useWebp);
      images = splitImages(srcSet);
      images.forEach((img) => {
        expect(img.includes('.webp')).toBe(true);
      });
    });

    it('Should return image sources fitted to a column layout when requested', () => {
      createImgSrcset(url, cols, layoutConfig, useWebp);
      Object.entries(cols).forEach(([bp, colSpan], index) => {
        expect(colsSpy).toHaveBeenNthCalledWith(++index, bp, layoutConfig, colSpan);
      });
    });

    it('Should return column-layout images with webp when requested', () => {
      // without webp
      let srcSet = createImgSrcset(url, undefined, undefined, useWebp);
      let images = splitImages(srcSet);
      images.forEach((img) => {
        expect(img.includes('.webp')).toBe(false);
      });

      // with webp
      useWebp = true;
      srcSet = createImgSrcset(url, undefined, undefined, useWebp);
      images = splitImages(srcSet);
      images.forEach((img) => {
        expect(img.includes('.webp')).toBe(true);
      });
    });
  });

  describe('createImgSizes function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // resets mock usage data between tests
    });

    it('Should return image sizes that cover all Vuetify media queries', () => {
      const sizes = createImgSizes();
      expect(sizes).toEqual(`(max-width: ${xs}px) ${xs}px, (max-width: ${sm}px) ${sm}px, (max-width: ${md}px) ${md}px, (max-width: ${lg}px) ${lg}px, (min-width: ${xl}px) ${xxl}px`)
    });

    it('Should return image sizes fitted to a column layout when requested', () => {
      createImgSizes(cols, layoutConfig);
      Object.entries(cols).forEach(([bp, colSpan], index) => {
        expect(colsSpy).toHaveBeenNthCalledWith(++index, bp, layoutConfig, colSpan);
      });
    });
  });

  describe('imgWidthCalculator object', () => {
    const { getNextBp, getMaxThreshold, getContainerWidth, getContentWidth } = imgWidthCalculator;

    beforeAll(() => {
      colsSpy.mockRestore(); // removes mock implementation before tests
    });

    it('Calculates the correct nextBp', () => {
      const bp = 'md';
      const nextBp = getNextBp(bp);
      const nextIndex = Object.keys(gridBreakpoints).indexOf(nextBp);
      expect(nextBp).toBe(Object.keys(gridBreakpoints)[nextIndex]);
    });

    it('Calculates the correct maxThreshold for each breakpoint', () => {
      Object.keys(gridBreakpoints).forEach((bp) => {
        const maxThreshold = getMaxThreshold(bp as BreakpointKey);
        const expected = bp === 'xl' ? xxl : gridBreakpoints[bp as BreakpointKey]
        expect(maxThreshold).toBe(expected);
      });
    });

    it('Calculates the correct containerWidth for each breakpoint', () => {
      const maxThreshold = 959;
      const { containerMaxWidths, containerPaddingX } = styles;
      Object.keys(gridBreakpoints).forEach((bp) => {
        const containerWidth = getContainerWidth(bp as BreakpointKey, maxThreshold);
        const threshold = containerMaxWidths[bp as BreakpointKey] ?? maxThreshold;
        const expected = threshold * containerMaxWidths[bp as BreakpointKey] - 2 * containerPaddingX;
        expect(containerWidth).toBe(expected);
      });
    });

    it('Calculates the correct contentWidth based on useContainer boolean', () => {
      // useContainer true
      let useContainer = true;
      const containerWidth = 927;
      const maxThreshold = 959;
      let contentWidth = getContentWidth(useContainer, containerWidth, maxThreshold);
      expect(contentWidth).toBe(containerWidth)


      // useContainer false
      useContainer = false;
      contentWidth = getContentWidth(useContainer, containerWidth, maxThreshold);
      expect(contentWidth).toBe(maxThreshold);
    });

    it('Calculates the correct image width to be used inside columns', () => {
      const bp = 'md';
      const colSpan = cols[bp];

      // mocks md breakpoint
      const mocks = {
        minThreshold: 960,
        maxThreshold: 1263,
        containerWidth: 868,
        contentWidth: 868,
      };
      const maxThresholdSpy = jest.spyOn(imgWidthCalculator, 'getMaxThreshold').mockImplementationOnce(() => mocks.maxThreshold);
      const containerWidthSpy = jest.spyOn(imgWidthCalculator, 'getContainerWidth').mockImplementationOnce(() => mocks.containerWidth);
      const contentWidthSpy = jest.spyOn(imgWidthCalculator, 'getContentWidth').mockImplementationOnce(() => mocks.contentWidth);

      const imgWidth = imgWidthCalculator.calcImgWidthInCols(bp, layoutConfig, colSpan);
      const expected = (() => {
        const { rowMarginX, colPaddingX } = layoutConfig;
        const { gridColumns } = styles;
        const numCols = Math.round(gridColumns / colSpan);
        const innerGutter = 2 * colPaddingX * numCols + 2 * rowMarginX;
        const imgWidth = (mocks.contentWidth - innerGutter) * colSpan / gridColumns;
        return Math.ceil(imgWidth);
      })();

      expect(imgWidth).toBe(expected);
      expect(maxThresholdSpy).toHaveBeenCalledWith(bp);
      expect(containerWidthSpy).toHaveBeenCalledWith(bp, mocks.minThreshold, mocks.maxThreshold);
      expect(contentWidthSpy).toHaveBeenCalledWith(layoutConfig.useContainer, mocks.containerWidth, mocks.maxThreshold);
    });
  });
});

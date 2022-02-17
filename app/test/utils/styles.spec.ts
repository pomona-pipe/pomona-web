import stylesUtil from '~/utils/styles';

describe('Styles util', () => {

  describe('listFromSass function', () => {
    const { listFromSass } = stylesUtil;
    let sassList: string;
    let arr: string[];

    it('should convert Sass list delimmited by a comma', () => {
      sassList = 'xs sm md lg xl xxl';
      arr = listFromSass(sassList);
      expect(arr.length).toBe(6);
    });

    it('should convert Sass list delimmited by a comma', () => {
      sassList = 'xs,sm,md,lg,xl,xxl';
      arr = listFromSass(sassList);
      expect(arr.length).toBe(6);
    });

    it('should convert Sass list delimmited by a comma plus space', () => {
      sassList = 'xs, sm, md, lg, xl, xxl';
      arr = listFromSass(sassList);
      expect(arr.length).toBe(6);
    });
  });

  describe('objectFromLists function', () => {
    const { objectFromLists } = stylesUtil;
    const keys = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const values = ['0', '600', '960', '1264', '1904', '3824'];
    const expected = keys.reduce((acc, key, index) => ({
      ...acc, [key]: values[index]
    }), {} as Record<string, string>);

    it('should convert 2 arrays to an object', () => {
      const obj = objectFromLists(keys, values, undefined);
      expect(obj).toMatchObject(expected);
    });

    it('should modify the values of the object when there is a modifier function', () => {
      const modifier = (value: string) => value.charAt(1);
      const firstChars = objectFromLists(keys, values, modifier);
      const expected = keys.reduce((acc, key, index) => ({
        ...acc, [key]: values[index].charAt(1)
      }), {} as Record<string, string>);
      expect(firstChars).toMatchObject(expected);
    })
  })
})
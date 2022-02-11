import styleVars from '~/utils/styles/_variables.scss';
const {
  // vuetify
  bodyFontFamily,
  headingFontFamily,
  btnTextTransform,
  containerPaddingX,
  containerMaxWidths_keys,
  containerMaxWidths_values,
  rowMarginX,
  colPaddingX,
  gridColumns,
  gridBreakpoints_keys,
  gridBreakpoints_values,
  // app
  subheadingFontFamily,
  buttonFontFamily,
} = styleVars;

const gridBreakpoints: Record<BreakpointKey, number> = objectFromLists(
  listFromSass(gridBreakpoints_keys),
  listFromSass(gridBreakpoints_values),
  (value: string) => parseInt(value)
);

const containerMaxWidths: Record<ContainerKey, number> = objectFromLists(
  listFromSass(containerMaxWidths_keys),
  listFromSass(containerMaxWidths_values),
  (value: string) => parseInt(value)
);

function listFromSass(string: string) {
  const unquoted = string.replace(/['"]+/g, '');
  return unquoted.split(/[,\s?]\s*/);
}

function objectFromLists(keys: string[], values: string[], modifier?: (value: string) => any): Record<string, any> {
  return keys.reduce((acc, key, index) => ({
    ...acc,
    [key]: modifier ? modifier(values[index]) : values[index],
  }), {});
}

function useStyles() {
  return {
    // vuetify
    bodyFontFamily,
    headingFontFamily,
    btnTextTransform,
    containerPaddingX: parseInt(containerPaddingX),
    containerMaxWidths,
    rowMarginX: parseInt(rowMarginX),
    colPaddingX: parseInt(colPaddingX),
    gridColumns: parseInt(gridColumns),
    gridBreakpoints,
    // app
    subheadingFontFamily,
    buttonFontFamily,
  };
}

export type BreakpointKey = 'xs'| 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type ContainerKey = 'md' | 'lg' | 'xl';

export default {
  listFromSass,
  objectFromLists,
  useStyles,
}

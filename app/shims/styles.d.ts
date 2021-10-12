declare module '~/utils/styles/_variables.scss' {
  interface IVuetifyVars {
    // Vuetify scss vars: vuetify/src/styles/settings/_variables.scss
    containerMaxWidths_keys: 'md, lg, xl';
    containerMaxWidths_values: '900px, 1185px, 1785px';
    rowMarginX: '-12';
    colPaddingX: '12';
    gridColumns: '12';
    gridBreakpoints_keys: 'xs, sm, md, lg, xl, xxl';
    gridBreakpoints_values: '0, 600px, 960px, 1264px, 1904px, 3824px';
    // Vuetify overwrites: ~/assets/style/vuetify.scss
    bodyFontFamily: string;
    headingFontFamily: string;
    btnTextTransform: string;
    containerPaddingX: '16';
  }

  // Application styles: ~/assets/style/variables.scss
  interface IAppVars {
    subheadingFontFamily: string;
    buttonFontFamily: string;
  }

  const styleVars: IVuetifyVars & IAppVars;

  export default styleVars;
}


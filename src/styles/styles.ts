import { CSSClasses } from '../data/types'

const colorDark = '#222'
const colorDark2 = '#666'
const colorGray = '#e3e3e3'
const colorWhite = '#fff'
const colorThemeDark = '#6539C0'
const colorThemeLight = '#EFEBF9'

const styles: CSSClasses = {
  dark: {
    color: colorDark,
  },

  white: {
    color: colorWhite,
  },

  'bg-dark': {
    backgroundColor: colorDark2,
  },

  'bg-gray': {
    backgroundColor: colorGray,
  },

  'bg-theme-dark': {
    backgroundColor: colorThemeDark,
  },

  'bg-theme-light': {
    backgroundColor: colorThemeLight,
  },

  'theme-dark': {
    color: colorThemeDark,
  },

  'theme-light': {
    color: colorThemeLight,
  },

  'rad-sm': {
    borderRadius: '4px',
  },
  'rad-sm-t': {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px'
  },

  flex: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },

  flexEnd: {
    justifyContent: 'flex-end',
  },

  flexCenter: {
    justifyContent: 'center',
  },

  'w-auto': {
    flex: 1,
    paddingRight: '6px',
  },

  'ml-30': {
    flex: 1,
  },

  'w-100': {
    width: '100%',
  },

  'w-75': {
    width: '75%',
  },

  'w-70': {
    width: '70%',
  },

  'w-50': {
    width: '50%',
  },

  'w-55': {
    width: '55%',
  },

  'w-45': {
    width: '45%',
  },

  'w-60': {
    width: '60%',
  },

  'w-40': {
    width: '40%',
  },

  'w-48': {
    width: '48%',
  },

  'w-30': {
    width: '30%',
  },

  'w-25': {
    width: '25%',
  },

  'w-20': {
    width: '20%',
  },

  'w-17': {
    width: '17%',
  },

  'w-18': {
    width: '18%',
  },

  'w-10': {
    width: '10%',
  },

  'w-5': {
    width: '5%',
  },

  'bd-t': {
    borderTop: `1px solid ${colorThemeLight}`,
  },

  row: {
    border: `1px solid ${colorThemeLight}`,
    borderTop: `0px`,
  },

  'mt-40': {
    marginTop: '38px',
  },

  'mt-30': {
    marginTop: '28px',
  },

  'mt-20': {
    marginTop: '18px',
  },

  'mt-10': {
    marginTop: '8px',
  },

  'mb-3': {
    marginBottom: '1px',
  },
  'mr-3': {
    marginRight: '2px',
  },
  'mb-5': {
    marginBottom: '3px',
  },

  'ptb-4': {
    paddingTop: '2px',
    paddingBottom: '2px',
  },
  'p-4-8': {
    padding: '3x 6px',
  },

  'p-5': {
    padding: '3px',
  },

  'pl-5': {
    paddingLeft: '3px',
  },

  'p-10': {
    padding: '8px',
  },

  'pt-10': {
    paddingTop: '8px',
  },

  'pt-20': {
    paddingTop: '18px',
  },

  'pt-30': {
    paddingTop: '28px',
  },

  'pb-10': {
    paddingBottom: '8px',
  },

  'pb-20': {
    paddingBottom: '18px',
  },

  'pb-30': {
    paddingBottom: '28px',
  },

  right: {
    textAlign: 'right',
  },

  bold: {
    fontWeight: '600',
  },

  'fs-14': {
    fontSize: '10px',
  },

  'fs-16': {
    fontSize: '12px',
  },

  'fs-20': {
    fontSize: '16px',
  },

  'fs-45': {
    fontSize: '35px',
  },

  page: {
    fontFamily: 'Outfit',
    fontSize: '9px',
    color: '#555',
    padding: '45px 40px',
  },

  span: {
    padding: '2px 10px 2px 0',
  },

  logo: {
    display: 'block',
  }
}

export default styles

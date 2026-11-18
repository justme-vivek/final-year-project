import { Grid, styled } from '@mui/material'

 const Container = styled(Grid)(({ theme }) => ({
  padding: '20px',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'transparent',
  height: 'auto',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    height: 'auto', // Adjust height as per requirement
  },
}))

 const LogoContainer = styled(Grid)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
    justifyContent: 'center',
    // Adjust height as per requirement
  },
}))

 const ButtonContainer = styled(Grid)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-end !important',
  justifyContent: 'flex-end !important',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center !important',
    justifyContent: 'center !important',
    marginTop:"20px"
    // Adjust height as per requirement
  },
}))
export default ButtonContainer;
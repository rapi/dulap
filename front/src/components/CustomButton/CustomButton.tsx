import classes from './CustomButton.module.css'
import { ReactNode } from 'react'
import { Button, IconButton } from '@mui/material'
export const CustomButton = ({
  children,
  icon,
}: {
  children?: ReactNode
  icon: ReactNode
}) => {
  if (!children && icon) {
    return <IconButton>{icon}</IconButton>
  }
  return (
    <>
      <Button className={classes.ctaButton} {...{ startIcon: icon }}>
        <p className={classes.ctaButtonTitle}>{children}</p>
      </Button>
    </>
  )
}

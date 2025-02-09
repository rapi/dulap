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
      <Button className={classes.customButton} {...{ startIcon: icon }}>
        {children}
      </Button>
    </>
  )
}

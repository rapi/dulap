import classes from './CustomButton.module.css'
import { ReactNode } from 'react'
import { Button } from '@mui/material'
export const CustomButton = ({
  children,
  icon,
}: {
  children?: ReactNode
  icon: ReactNode
}) => {
  return (
    <>
      <Button className={classes.customButton} {...{ startIcon: icon }}>
        {children}
      </Button>
    </>
  )
}

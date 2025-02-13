import classes from './CustomButton.module.css'
import { FC, ReactNode } from 'react'
import { Button, IconButton } from '@mui/material'
import classNames from 'classnames'
interface CustomButtonProps {
  children?: ReactNode
  icon: ReactNode
  outlined?: boolean
  size?: 'small' | 'medium' | 'large'
}
export const CustomButton: FC<CustomButtonProps> = ({
  children,
  icon,
  outlined,
  size,
}) => {
  if (!children && icon) {
    return <IconButton>{icon}</IconButton>
  }
  return (
    <>
      <Button
        className={classNames([
          classes.ctaButton,
          outlined && classes.outlined,
          classes[`${size}Size`],
        ])}
        {...{ startIcon: icon }}
      >
        <p className={classes.ctaButtonTitle}>{children}</p>
      </Button>
    </>
  )
}

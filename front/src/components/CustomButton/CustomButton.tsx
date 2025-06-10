import classes from './CustomButton.module.css'
import { FC, ReactNode } from 'react'
import { Button, IconButton } from '@mui/material'
import classNames from 'classnames'
interface CustomButtonProps {
  children?: ReactNode
  icon?: ReactNode
  outlined?: boolean
  href?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'danger'
  onClick?: () => void
}
export const CustomButton: FC<CustomButtonProps> = ({
  children,
  icon,
  outlined,
  size = 'medium',
  href,
  variant = 'primary',
  onClick,
}) => {
  if (!children && icon) {
    return (
      <IconButton size={size} color="warning">
        {icon}
      </IconButton>
    )
  }
  const additionalProps = {
    startIcon: icon,
    ...(icon && { startIcon: icon }),
    ...(href && { href }),
    ...(onClick && { onClick }),
  }
  return (
    <>
      <Button
        className={classNames([
          classes.ctaButton,
          outlined && classes.outlined,
          classes[`${size}Size`],
          classes[`${variant}Variant`],
        ])}
        size={size}
        {...additionalProps}
      >
        <p className={classes.ctaButtonTitle}>{children}</p>
      </Button>
    </>
  )
}

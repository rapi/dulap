import classes from './CustomLink.module.css'
import { ReactNode } from 'react'
import { Link } from '@mui/material'
export const CustomLink = ({
  children,
  href,
}: {
  children?: ReactNode
  href: string
}) => {
  return (
    <>
      <Link href={href} className={classes.customLink}>
        {children}
      </Link>
    </>
  )
}

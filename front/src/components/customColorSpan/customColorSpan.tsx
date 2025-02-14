import classes from './customColorSpan.module.css'
import { FC, ReactNode } from 'react'
import classNames from 'classnames'
interface customColorSpanProps {
  color: ReactNode
}
export const customColorSpan: FC<customColorSpanProps> = ({
  color,
}) => {
  return (
    <>
      <span
        style={{ backgroundColor: color}}
        className={classes.colorItem}
      >
      </span>
    </>
  )
}
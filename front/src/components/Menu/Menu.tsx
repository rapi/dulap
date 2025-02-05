import { CustomButton } from '~/components/CustomButton/CustomButton'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import classes from './Menu.module.css'
import { CustomLink } from '~/components/CustomLink/CustomLink'
export const Menu = () => {
  return (
    <div className={classes.menu}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Logo dulap.md" />
      <div>
        <CustomLink href="/about">Dulapuri</CustomLink>
        <CustomLink href="/contact">Comode</CustomLink>
        <CustomLink href="/contact">Rafturi</CustomLink>
        <CustomButton icon={<CheckroomIcon />}>Incearca Aici</CustomButton>
      </div>
    </div>
  )
}

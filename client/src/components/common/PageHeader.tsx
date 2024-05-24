import { Link } from 'react-router-dom'
import { Anchor, Breadcrumbs, Group, Text } from '@mantine/core'
import { ReactNode } from 'react'

export interface ListItemProps {
  title: string
  href: string
}

interface PageHeaderProps {
  title: ReactNode
  listItems: ListItemProps[]
}

function PageHeader({ title, listItems }: PageHeaderProps) {
  const newListItems = [{ title: 'หน้าหลัก', href: '/' }, ...listItems]

  const items = newListItems.map((item, index) => {
    if (item.href == '#') {
      return (
        <Text c='dimmed' key={index} size='sm'>
          {item.title}
        </Text>
      )
    } else {
      return (
        <Anchor component={Link} to={item.href} key={index} size='sm'>
          {item.title}
        </Anchor>
      )
    }
  })

  return (
    <Group justify='space-between'>
      <Text size='md'>{title}</Text>
      <Breadcrumbs py={15} style={{ flexWrap: 'wrap' }}>
        {items}
      </Breadcrumbs>
    </Group>
  )
}

export default PageHeader

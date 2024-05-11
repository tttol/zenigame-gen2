import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Page2 from '../app/Page2'
 
test('Page2', () => {
  render(<Page2 />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
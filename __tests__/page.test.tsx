import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Home from '../app/page'

test('Home', () => {
    render(<Home />)
    expect(screen.findByText('ZENIGAME')).toBeDefined();
})
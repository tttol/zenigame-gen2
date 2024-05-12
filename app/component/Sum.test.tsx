import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Sum from './Sum';
test('Sum', () => {
    render(<Sum details={[]} />)
    expect(screen.getByRole('heading', { level: 1, name: 'ZENIGAME' })).toBeDefined()
})
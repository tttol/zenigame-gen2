import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Sum from './Sum';

test('Sum', () => {
    const details = [
        {
            id: '1',
            name: 'Test Detail 1',
            price: 1000,
            label: 'Test Label 1',
            paidByUserA: true,
            paidByUserB: false,
            paidAt: '2022-01-01',
        },
        {
            id: '2',
            name: 'Test Detail 2',
            price: 2000,
            label: 'Test Label 2',
            paidByUserA: false,
            paidByUserB: true,
            paidAt: '2022-02-01',
        },
        // 他のテスト用データ...
    ];
    render(<Sum details={details as any} />)

    const price = "￥500";
    expect(screen.getByText(price)).toBeDefined();
})
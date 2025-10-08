import { render, screen } from '@testing-library/react';

test('demo test', () => {
    render(<div>Hello Jest</div>);
    expect(screen.getByText('Hello Jest')).toBeInTheDocument();
});
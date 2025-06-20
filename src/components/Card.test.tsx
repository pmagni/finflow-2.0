import { render, screen } from '@testing-library/react';
import Card from './Card';
import { describe, it, expect } from 'vitest';

describe('Card component', () => {
  it('should render its children correctly', () => {
    const testMessage = 'Hello, Card!';
    render(
      <Card>
        <p>{testMessage}</p>
      </Card>
    );

    // Check if the paragraph with the test message is in the document
    const paragraphElement = screen.getByText(testMessage);
    expect(paragraphElement).toBeInTheDocument();
  });

  it('should apply additional className passed as a prop', () => {
    const customClass = 'my-custom-class';
    const { container } = render(<Card className={customClass} />);
    
    // The component's root div is the first child of the container
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass(customClass);
  });
}); 
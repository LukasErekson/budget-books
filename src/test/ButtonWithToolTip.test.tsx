import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import ButtonWithToolTip from '../components/ButtonWithToolTip';

describe('Button With Tool Tip Component', () => {
  it('Renders the button without error', () => {
    render(
      <ButtonWithToolTip onClick={() => {}} toolTipContent={'Test Button'}>
        Button Text
      </ButtonWithToolTip>
    );
  });

  it('Displays the tooltip on hover', async () => {
    render(
      <ButtonWithToolTip onClick={() => {}} toolTipContent={'Test Button'}>
        Button Text
      </ButtonWithToolTip>
    );

    let exampleButton = await screen.findByText('Button Text');

    fireEvent.mouseOver(exampleButton);

    let tooltip = await screen.findByText('Test Button');

    expect(tooltip).toBeDefined();
    expect(tooltip.classList).not.toContain('hide');
  });

  it('Hides the tooltip by default', async () => {
    render(
      <ButtonWithToolTip onClick={() => {}} toolTipContent={'Test Button'}>
        Button Text
      </ButtonWithToolTip>
    );

    let tooltip = await screen.findByText('Test Button');

    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain('hide');
  });
});

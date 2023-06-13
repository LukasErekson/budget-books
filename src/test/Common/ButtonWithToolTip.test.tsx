import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import ButtonWithToolTip from '../../components/ButtonWithToolTip';

describe('Button With Tool Tip Component', () => {
  it('Renders the button without error', () => {
    render(
      <ButtonWithToolTip onClick={() => null} toolTipContent={'Test Button'}>
        Button Text
      </ButtonWithToolTip>
    );
  });

  it('Displays the tooltip on hover', async () => {
    render(
      <ButtonWithToolTip onClick={() => null} toolTipContent={'Test Button'}>
        Button Text
      </ButtonWithToolTip>
    );

    const exampleButton = await screen.findByText('Button Text');

    fireEvent.mouseOver(exampleButton);

    const tooltip = await screen.findByText('Test Button');

    fireEvent.mouseOut(exampleButton);

    expect(tooltip).toBeDefined();
  });

  it('Removes the tooltip on hover out', async () => {
    render(
      <ButtonWithToolTip onClick={() => null} toolTipContent={'Test Button'}>
        Button Text
      </ButtonWithToolTip>
    );

    const exampleButton = await screen.findByText('Button Text');

    fireEvent.mouseOver(exampleButton);

    const tooltip = await screen.findByText('Test Button');

    fireEvent.mouseLeave(exampleButton);

    expect(tooltip).toBeDefined();
  });
});

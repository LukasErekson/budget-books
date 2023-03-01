import React from 'react';

import { BulkActionModal } from '../../features/CategorizeTransactions';

describe('Bulk Action Modal', () => {
  it.todo('Renders without error');
  // Warnings displayed, buttons, etc.

  it.todo('Displays selected transactions');

  it.todo('Says "transaction" if only one transaction is selected');

  describe('Categorizing multiple transactions', () => {
    it.todo('Dispatches categorization for multiple transactions');

    it.todo('Removes the selected transactions from props');

    it.todo('Closes the modal on submit');
  });

  describe('Deleting multiple transactions', () => {
    it.todo('Dispatches delete for multiple transactions');

    it.todo('Removes the selected transactions from props');

    it.todo('Closes the modal on submit');
  });
});

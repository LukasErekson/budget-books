import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select, { OptionsOrGroups } from 'react-select';
import { RootState } from '../../store';
import {
  selectAccountTypeByGroups,
  selectAccountTypeNames,
  selectAccountTypes,
} from './accountTypeSelectors';
import AccountType from './accountTypeTSTypes';

function AccountTypeSelector(props: {
  setCategory: Function;
  category: Number;
  setInputCategory: Function;
  inputCategory: string;
}): JSX.Element {
  let options: OptionsOrGroups<Number, any> = useSelector((state: RootState) =>
    selectAccountTypeByGroups(state)
  );

  const accountTypes: AccountType[] = useSelector((state: RootState) =>
    selectAccountTypes(state)
  );
  const accountTypeNames: string[] = useSelector((state: RootState) =>
    selectAccountTypeNames(state)
  );

  useEffect(() => {
    props.setCategory(options[0].options[0]);
  }, []);

  return (
    <Select
      name={'accountType'}
      options={options.concat({
        label: 'New Category',
        options: [
          {
            label: `Create new category: ${props.inputCategory}`,
            value: -1,
          },
        ],
      })}
      onInputChange={(newValue: string) => props.setInputCategory(newValue)}
      value={props.category}
      onChange={(newCategory: any) => {
        // Allow for a new category.
        if (newCategory.value === -1) {
          newCategory.label = newCategory.label.slice(21);
          if (newCategory.label === '') {
            return;
          }
          if (accountTypeNames.includes(newCategory.label)) {
            const matchingAccountType: AccountType = accountTypes.filter(
              (accountTypeObject: AccountType) =>
                accountTypeObject.name === newCategory.label
            )[0];
            props.setCategory({
              label: matchingAccountType.name,
              value: matchingAccountType.id,
            });
            return;
          }
        }
        props.setCategory(newCategory);
      }}
    />
  );
}

export default AccountTypeSelector;

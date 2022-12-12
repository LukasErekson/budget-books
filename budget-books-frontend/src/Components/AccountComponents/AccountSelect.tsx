import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import Select, { OptionsOrGroups } from 'react-select';
import {
  selectAccountTypeNames,
  selectAccountTypes,
} from '../AccountTypeComponents/accountTypeSelectors';
import { selectAccountOptions } from '../AccountComponents/accountSelectors';
import Account from './accountTSTypes';
import AccountType from '../AccountTypeComponents/accountTypeTSTypes';
import { RootState } from '../../store';

function AccountSelect(props: {
  setCategory: Function;
  category: Number;
  setInputCategory: Function;
  inputCategory: string;
  excludeAccount: Account;
}): JSX.Element {
  let options: OptionsOrGroups<Number, any> = useSelector((state: any) =>
    selectAccountOptions(state)
  );

  const accountTypes: AccountType[] = useSelector((state: RootState) =>
    selectAccountTypes(state)
  );
  const accountNames = useSelector((state: RootState) =>
    selectAccountTypeNames(state)
  );

  useEffect(() => {
    props.setCategory(options[0].options[0]);
  }, []);

  return (
    <Select
      name={'account'}
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
          if (accountNames.includes(newCategory.label)) {
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

        if (newCategory.value === props.excludeAccount.id) {
          return;
        }
        props.setCategory(newCategory);
      }}
    />
  );
}

const mapDipsatchToProps = (dispatch: Function) => {
  return {};
};

export default connect(null, mapDipsatchToProps)(AccountSelect);

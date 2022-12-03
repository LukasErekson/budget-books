import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import Select from 'react-select';
import {
  selectAccountTypeNames,
  selectAccountTypes,
} from '../AccountTypeComponents/accountTypeSelectors';
import { selectAccountOptions } from '../AccountComponents/accountSelectors';

function AccountSelect(props: {
  setCategory: Function;
  category: Number;
  setInputCategory: Function;
  inputCategory: string;
  excludeAccount: any | null;
}): JSX.Element {
  let options: any[] = useSelector((state: any) => selectAccountOptions(state));

  const excludeAccountIdx: number = options.indexOf(props.excludeAccount);

  const accountTypes: any[] = useSelector((state: any) =>
    selectAccountTypes(state)
  );
  const accountNames = useSelector((state: any) =>
    selectAccountTypeNames(state)
  );

  useEffect(() => {
    props.setCategory(options[0].options[0]);
  }, [options]);

  return (
    <Select
      name={'account'}
      options={options.concat({
        label: `Create new category: ${props.inputCategory}`,
        value: -1,
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
            const matchingAccount: any = accountTypes.filter(
              (accountTypeObject: any) =>
                accountTypeObject.name === newCategory.label
            )[0];
            props.setCategory({
              label: matchingAccount.name,
              value: matchingAccount.id,
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

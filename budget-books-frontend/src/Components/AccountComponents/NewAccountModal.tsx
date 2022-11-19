import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { connect } from 'react-redux';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';
import {
    selectAccountTypes,
    selectAccountTypeByGroups,
    selectAccountTypeNames,
} from '../AccountTypeComponents/accountTypeSelectors';

function NewAccountModal(props: {
    isOpen: boolean;
    onRequestClose: any;
    fetchAccountTypes: Function;
    selectAccountTypes: any[];
    selectAccountTypeByGroups: any[];
    selectAccountTypeNames: string[];
}): JSX.Element {
    const [category, setCategory]: [any, Function] = useState({});
    const [inputCategory, setInputCategory]: [string, Function] = useState('');

    const [accountName, setAccountName]: [string, Function] = useState('');

    const [debitInc, setDebitInc]: [boolean, Function] = useState(true);

    const options: any[] = props.selectAccountTypeByGroups;

    console.log(accountName);
    console.log(debitInc);

    useEffect(() => {
        if (Object.keys(options).length === 0) {
            props.fetchAccountTypes('all');
        } else setCategory(options[0].options[0]);
    }, [options, props]);

    return (
        <>
            <Modal
                isOpen={props.isOpen}
                onRequestClose={props.onRequestClose}
                appElement={document.getElementById('root') || undefined}
            >
                <h1>Add New Account</h1>
                <label htmlFor='accountName'>Account Name:</label>
                <input
                    type='text'
                    name='accountName'
                    value={accountName}
                    placeholder='Account Name...'
                    onChange={(event: any) =>
                        setAccountName(event.target.value)
                    }
                />

                <br />

                <label htmlFor='accountType'>Category:</label>
                <Select
                    name={'accountType'}
                    options={options.concat({
                        label: `Create new category: ${inputCategory}`,
                        value: -1,
                    })}
                    onInputChange={(newValue: string) =>
                        setInputCategory(newValue)
                    }
                    value={category}
                    onChange={(newCategory: any) => {
                        // Allow for a new category.
                        if (newCategory.value === -1) {
                            newCategory.label = newCategory.label.slice(21);
                            if (newCategory.label === '') {
                                return;
                            }
                            if (
                                props.selectAccountTypeNames.includes(
                                    newCategory.label
                                )
                            ) {
                                const matchingAccountType: any =
                                    props.selectAccountTypes.filter(
                                        (accountTypeObject: any) =>
                                            accountTypeObject.name ===
                                            newCategory.label
                                    )[0];
                                setCategory({
                                    label: matchingAccountType.name,
                                    value: matchingAccountType.id,
                                });
                                return;
                            }
                        }
                        setCategory(newCategory);
                    }}
                />

                <br />

                <label htmlFor='debitInc'>Balance increases with debits?</label>
                <input
                    type='checkbox'
                    name='debitInc'
                    id='debitIncCB'
                    checked={debitInc}
                    onChange={(event) => setDebitInc(!debitInc)}
                    defaultChecked={true}
                />
            </Modal>
        </>
    );
}

const mapStateToProps = (state: any) => {
    return {
        selectAccountTypes: selectAccountTypes(state),
        selectAccountTypeByGroups: selectAccountTypeByGroups(state),
        selectAccountTypeNames: selectAccountTypeNames(state),
    };
};

const mapDipsatchToProps = (dispatch: Function) => {
    return {
        fetchAccountTypes: (group: string) =>
            dispatch(fetchAccountTypes(group)),
    };
};

export default connect(mapStateToProps, mapDipsatchToProps)(NewAccountModal);

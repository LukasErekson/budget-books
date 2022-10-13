"""
Utility functions to be used to help with backend operations.
"""


def dict_to_json(dictionary: dict, id_range: range) -> list[dict]:
    """Convert a given dictionary (from a pandas dataframe) to one that
    is in more standard JSON format.
    i.e - An array of objects (dicts) instead of mapping
    dictionary[key][id] = key_value for each object.

    Parameters
    ----------
        dictionary (dict) : A dictionary of the form:
            {col1_name: [row1,row2, ...], ...,
             coln_name:[row1, row2, ...]}
        id_range (range) : The range of values to iterate over; for a
            Pandas DataFrame, this would be the index.

    Returns
    -------
        jsonList (list[dict]) : A list of dictionaries corresponding to
            the standard JSON format. This can be thought of as a list
            of JSON objects, represented by dictionaries in Python.
    """
    json_list = []
    for i in id_range:
        object_dict = dict()
        for key in dictionary:
            object_dict[key] = dictionary[key][i]
        json_list.append(object_dict)

    return json_list

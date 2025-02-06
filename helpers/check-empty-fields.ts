export const checkEmptyFields = (data: Record<string, any>, keysToCheck: string[]): string[] => {
  if (!data) return [];

  return keysToCheck.filter(
    key => data[key] === "" || data[key] === null || data[key] === undefined
  );
};

export const removeEmptyField = (
  field: string,
  setEmptyFields: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setEmptyFields(prevFields => prevFields.filter(item => item !== field));
};
